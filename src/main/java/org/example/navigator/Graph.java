package org.example.navigator;


import gnu.trove.map.hash.TLongObjectHashMap;
import gnu.trove.set.hash.THashSet;

import java.io.*;
import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.example.navigator.Util.*;

@SuppressWarnings("SpellCheckingInspection")
public class Graph {
    public static final int ncells = 10;
    double minlat;
    double maxlat;
    double minlon;
    double maxlon;
    private ArrayList<Node>[] cells = new ArrayList[ncells*ncells];



    public TLongObjectHashMap<Node> nodes = new TLongObjectHashMap<>();
    public List<Way> ways = new ArrayList<>();


    public LinkedHashMap<Long, Obstacle> obstacles = new LinkedHashMap<>();

    private Logger logger = Logger.getLogger(getClass().getName());


    public Graph(double minlon, double minlat, double maxlon, double maxlat) {
        this.minlat = minlat;
        this.maxlat = maxlat;
        this.minlon = minlon;
        this.maxlon = maxlon;

        for (int i = 0; i < ncells*ncells; i++) {
            cells[i] = new ArrayList<>();
        }
    }

    private int findCell(Node n) {
        int j = bound((int) ((n.lon - minlon) * ncells / (maxlon - minlon)), 0, ncells - 1);
        int i = bound((int)((n.lat - minlat)*ncells/(maxlat - minlat)), 0, ncells-1);
        return i*ncells + j;
    }

    public void addNode(Node n, boolean addToCell) {
        nodes.put(n.id, n);
        if (addToCell) cells[findCell(n)].add(n);
        //do no place into cell yet
    }

    private Stream<Edge> closestEdges(Node node, double dist) {
        return cells[findCell(node)].stream()
                .flatMap(n -> n.edges.stream())
                .filter(e -> e.distTo(node) < dist);
    }


    public void addObstacle(Obstacle o) {
        obstacles.put(o.id, o);
        Collection<Edge> edges = o.isDistanceBlocking ?
                closestEdges(o, Obstacle.AoeDistanceToEdge).collect(Collectors.toSet()) :
                findClosestPedestrian(o).map(w -> w.edges).orElse(new ArrayList<>());

        o.nearEdges.addAll(edges);
        for (Edge e: edges) e.obstacles++;
    }



    public Optional<Way> findClosestPedestrian(Node n) {
        return findClosestEdge(n)
                .map(e -> e.way);
    }

    private Optional<Edge> findClosestEdge(Node n) {
        return closestEdges(n, Obstacle.MaxDistanceToEdge)
                .filter(e -> e.way.roadType == RoadType.PEDESTRIAN)
                .min((e1,e2) -> Double.compare(e1.distTo(n), e2.distTo(n)));
    }

    public Obstacle getObstacle(long id) {
        return obstacles.get(id);
    }

    public Collection<Obstacle> allObstaclesSorted() {
        return obstacles.values();
    }

    public boolean removeObstacle(long id) {
        Obstacle o;
        if ((o = obstacles.remove(id)) != null) {
            for (Edge e: o.nearEdges) e.obstacles--;
            return true;
        } else {
            return false;
        }
    }




    public void addWay(Way w) {
//        w.start.ways.add(w);
//        w.end.ways.add(w);
        ways.add(w);

        //inner
//        for (Node n: w.nodes) {
//            if (n == w.start || n == w.end) continue;
//            n.insideWays.add(w);
//        }
    }

    public synchronized void removeUnconnectedComponents() {

//        //correctness
//        for (Node node: nodes.values()) {
//            if ((node.ways.size() > 0 && node.insideWays.size() > 0) || node.insideWays.size() > 1) {
//                System.err.println("Bad node: "+node);
//            }
//        }

        //connected components
        ArrayList<List<Node>> conComps = new ArrayList<>();
        int numberOfComp = 0;

        logger.info("-> removeUnconnectedComponents()");
        logger.info(String.format("nodes: %d, ways: %d, edges: %d",
                  nodes.size()
                , ways.size()
                , ways.stream().map(w -> w.edges.size()).reduce(Integer::sum).get()
        ));


        for (Node node: nodes.valueCollection()) {
            if (node.number == 0) {
                int mark = ++numberOfComp;
                conComps.add(new ArrayList<>());

                LinkedList<Node> bfsFront = new LinkedList<>();
                bfsFront.add(node);
                while (!bfsFront.isEmpty()) {

                    Node n = bfsFront.removeFirst();
                    n.number = mark;
                    conComps.get(mark - 1).add(n);

                    for (Edge e: n.edges) {
                        Node nn = e.otherEnd(n);
                        if (nn.number == 0) {
                            bfsFront.addLast(nn);
                            nn.number = -1;
                        }
                    }
                }
            }
        }

        Collections.sort(conComps, (lst1, lst2) -> -Integer.compare(lst1.size(), lst2.size()));
        final int bestcomp = conComps.get(0).get(0).number;

        //assertion check
        int assertionNodesCount = conComps.stream().map(List::size).reduce(Integer::sum).get();
        if (assertionNodesCount != nodes.size()) throw new IllegalStateException(assertionNodesCount+"!="+nodes.size());

        logger.info("Connected components: " + conComps.size());
        conComps = null; //for better GC

        //clear nodes without ways;
        final TLongObjectHashMap<Node> survivedNodes = new TLongObjectHashMap<>();
        final THashSet<Way> survivedWays = new THashSet<>();
        nodes.forEachEntry((idx, n) -> {
        //for (HashMap.Entry<Long, Node> entry: nodes.entrySet()) {
//            if (entry.getValue().ways.size() > 0) {
            //Node n = entry.getValue();
            if (n.number == bestcomp) {
                survivedNodes.put(idx, n);
                cells[findCell(n)].add(n);
                n.edges.stream().map(e -> e.way).forEach(survivedWays::add);
            }
            n.number = 0; //light clear right here to save time
            return true;
        });

        survivedNodes.trimToSize();
        nodes = survivedNodes;
        ways = new ArrayList<>(survivedWays.size() + 1000); //for buses ways etc.
        ways.addAll(survivedWays);


        logger.info(String.format("nodes: %d, ways: %d, edges: %d",
                nodes.size()
                , ways.size()
                , ways.stream().map(w -> w.edges.size()).reduce(Integer::sum).get()
        ));


    }




    public synchronized Path aStar(Node start, Node goal) {

        HashSet<Node> q0 = new HashSet<>();
        NodeQueue q1 = new NodeQueue();


        //verify correctness
        if (start == null || goal == null) return new Path();

        //setup
        q1.add(start);


        //cycle
        while (q1.size() > 0) {
            Node closestNode = q1.poll();
            if (closestNode == null) break;
            q0.add(closestNode); //for clearing purposes
            if (closestNode == goal) break;


            for (Edge e : closestNode.edges) {
                if (e.isBlocked()) continue;

                Node n = e.otherEnd(closestNode);
                if (q0.contains(n)) continue;
                boolean shouldAdd = n.cachedDist == 0;
                if (shouldAdd || n.cachedDist > closestNode.cachedDist + e.effectiveDist) {
                    n.prevEdge = e;
                    n.cachedDist = closestNode.cachedDist + e.effectiveDist;
                    n.heurictics = n.cachedDist + n.dist(goal)*RoadType.HeuristicsCoeff;
                    if (!shouldAdd) q1.heapUp(n.number);
                }
                if (shouldAdd) q1.add(n);
            }
        }

        Path res = new Path();
        goal.traversePrev(n -> { if (n.prevEdge != null) res.edges.add(n.prevEdge); });
        Stream.concat(q0.stream(), q1.stream()).forEach(Node::clearCached);

        return res;
    }


    public Node findNodeOrEdge(Node n, double maxdist) {
        Node closestNode = find(n.lon, n.lat, maxdist);

        Optional<Edge> closestPedestrian = findClosestEdge(n);
        if (!closestPedestrian.isPresent()) return closestNode;

        EdgeNode edgeNode = EdgeNode.create(n, closestPedestrian.get());

        //some magic here to prefer pedastrian over roads
        double dist = n.dist(edgeNode);
        if (dist < 10 || dist < n.dist(closestNode)) return edgeNode;
        else return closestNode;
    }

    public synchronized Node find(double lon, double lat, double maxdist) {
        Node test = new Node(0, lon, lat);

        List<Node> res = new ArrayList<>(100);

        for (Node n: cells[findCell(test)]) {
            if (!n.edges.stream().anyMatch(e -> !e.isBlocked())) continue;

            double dist = n.dist(test);
            if (dist > maxdist) continue;

            n.cachedDist = dist;
            res.add(n);
        }

        if (res.size() == 0) return null;

        Collections.sort(res, (n1, n2) -> Double.compare(n1.cachedDist, n2.cachedDist));
        for (Node n: res) n.cachedDist = 0;

        return res.get(0);
    }

    public synchronized Path djikstra(Node n1, Node n2) {

        HashSet<Node> q0 = new HashSet<>();
        HashSet<Node> q1 = new HashSet<>();

        //verify correctness
        if (n1 == null || n2 == null) return new Path();

        //setup
        q1.add(n1);


        //cycle
        while (q1.size() > 0) {
            Node min = null;
            for (Node n : q1) {
                if (min == null || min.cachedDist > n.cachedDist) min = n;
            }

            if (min == n2 || min == null) break;
            q0.add(min);
            q1.remove(min);
            for (Edge e : min.edges) {
                if (e.isBlocked()) continue;

                Node nn = e.otherEnd(min);
                if (q0.contains(nn)) continue;
                if (nn.cachedDist == 0 || nn.cachedDist > min.cachedDist + e.effectiveDist) {
                    nn.prevEdge = e;
                    nn.cachedDist = min.cachedDist + e.effectiveDist;
                }
                q1.add(nn);
            }
        }

        Path res = new Path();
        n2.traversePrev(n -> { if (n.prevEdge != null) res.edges.add(n.prevEdge); });
        Stream.concat(q0.stream(), q1.stream()).forEach(Node::clearCached);

        return res;
    }

    public synchronized void clear() {
        nodes.forEachValue(n -> {n.clearCached(); return true;});
    }

    public void serialize(DataOutputStream os) throws Exception {
        os.writeDouble(minlon);
        os.writeDouble(minlat);
        os.writeDouble(maxlon);
        os.writeDouble(maxlat);

        os.writeInt(nodes.size());
        nodes.forEachValue(n -> {
            try {
                os.writeLong(n.id);
                os.writeDouble(n.lon);
                os.writeDouble(n.lat);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            return true;
        });
        os.writeInt(ways.size());
        ways.stream().forEach(w -> {
            try {
                os.writeLong(w.id);
                os.writeInt(w.roadType.typeId);

                os.writeInt(w.edges.size() + 1);

                os.writeLong(w.edges.get(0).start.id);
                for (Edge e: w.edges) {
                    os.writeLong(e.end.id);
                }
            } catch (IOException e) {
                throw new RuntimeException(e);
            }

        });
    }

    public static Graph deserialize(DataInputStream is) throws Exception {
        double minlon = is.readDouble();
        double minlat = is.readDouble();
        double maxlon = is.readDouble();
        double maxlat = is.readDouble();

        Graph res = new Graph(minlon, minlat, maxlon, maxlat);
        int nNodes = is.readInt();

        for (int i=0; i<nNodes; i++) {
            long id = is.readLong();
            double lon = is.readDouble();
            double lat = is.readDouble();
            res.addNode(new Node(id, lon, lat), true);
        }

        int nWays = is.readInt();
        for (int i = 0; i < nWays; i++) {
            long id = is.readLong();
            Way w = new Way(id);

            int roadType = is.readInt();
            w.roadType = RoadType.fromTypeId(roadType);

            nNodes = is.readInt();
            for (int j = 0; j < nNodes; j++) {
                Node n = res.nodes.get(is.readLong());
                w.nodes.add(n);
            }
            w.finish();
            res.addWay(w);
        }
        return res;
    }
}
