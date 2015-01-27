package org.example.navigator;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.example.navigator.Util.*;

/**
 * Created by Dmitry.Ivanov on 10/25/2014.
 */
@SuppressWarnings("SpellCheckingInspection")
public class Graph {
    public static final int ncells = 10;
    double minlat;
    double maxlat;
    double minlon;
    double maxlon;
    private ArrayList<Node>[] cells = new ArrayList[ncells*ncells];


    private int bestcomp;


    public HashMap<Long, Node> nodes = new HashMap<>();
    public List<Way> ways = new ArrayList<>();

    public LinkedHashMap<Long, Obstacle> obstacles = new LinkedHashMap<>();

    public int nconcomp = 0;
    public ArrayList<List<Node>> concomp = new ArrayList<>();


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

    public void addNode(Node n) {
        nodes.put(n.id, n);

    }

    public void addObstacle(Obstacle o) {
        obstacles.put(o.id, o);
        List<Edge> edges = (ways.stream()
                .flatMap(way -> way.edges.stream())
                .filter(e -> e.distTo(o) < Obstacle.DistanceToEdge)
                .collect(Collectors.toList()));

        o.nearEdges.addAll(edges);
        for (Edge e: edges) e.obstacles.add(o);
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
            for (Edge e: o.nearEdges) e.obstacles.remove(o);
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
        for (Node n: w.nodes) {
            if (n == w.start || n == w.end) continue;
            n.insideWays.add(w);
        }
    }

    public void finishLoading() {

//        //correctness
//        for (Node node: nodes.values()) {
//            if ((node.ways.size() > 0 && node.insideWays.size() > 0) || node.insideWays.size() > 1) {
//                System.err.println("Bad node: "+node);
//            }
//        }

        //connectivity components
        for (Node node: nodes.values()) {
            if (node.concomp == 0) {
                int mark = ++nconcomp;
                concomp.add(new ArrayList<>());

                LinkedList<Node> nodes = new LinkedList<>();
                nodes.add(node);
                while (!nodes.isEmpty()) {

                    Node n = nodes.removeFirst();
                    n.concomp = mark;
                    concomp.get(mark-1).add(n);

                    for (Edge e: n.edges) {
                        Node nn = e.otherEnd(n);
                        if (nn.concomp == 0) {
                            nodes.addLast(nn);
                            nn.concomp = -1;
                        }
                    }
                }
            }
        }
        Collections.sort(concomp, (lst1, lst2) -> -Integer.compare(lst1.size(), lst2.size()));
        bestcomp = concomp.get(0).get(0).concomp;

        //assertion check
        int ncount = concomp.stream().map(lst -> lst.size()).reduce((a, b) -> a + b).get();
        if (ncount != nodes.size()) throw new IllegalStateException(ncount+"!="+nodes.size());

        //clear nodes without ways;
        HashMap<Long, Node> newNodes = new HashMap<>();
        for (HashMap.Entry<Long, Node> entry: nodes.entrySet()) {
//            if (entry.getValue().ways.size() > 0) {
            Node n = entry.getValue();
            if (n.concomp == bestcomp) {
                newNodes.put(entry.getKey(), n);
                cells[findCell(n)].add(n);
            }
        }
        nodes = newNodes;
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


    public Node find(Node n, double maxdist) {
        return find(n.lon, n.lat, maxdist);
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
        for (Node n: nodes.values()) {
            n.clearCached();
        }
    }
}
