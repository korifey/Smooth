package org.example.navigator;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by Dmitry.Ivanov on 10/25/2014.
 */
public class Graph {


    private int bestcomp;


    public HashMap<Long, Node> nodes = new HashMap<>();
    public List<Way> ways = new ArrayList<>();

    public int nconcomp = 0;
    public ArrayList<List<Node>> concomp = new ArrayList<>();



    public void addNode(Node n) {
        nodes.put(n.id, n);
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
            if (entry.getValue().concomp == bestcomp) {
                newNodes.put(entry.getKey(), entry.getValue());
            }
        }
        nodes = newNodes;
    }


    public void djikstra(long nd1, long nd2) {

        HashSet<Node> q0 = new HashSet<>();
        HashSet<Node> q1 = new HashSet<>();
        HashSet<Node> q2 = new HashSet<>(nodes.values());

        //clear
        for (HashMap.Entry<Long, Node> e : nodes.entrySet()) {
            Node n = e.getValue();
            n.cachedDist = 0;
            n.prevEdge = null;
            q2.add(n);
        }


        Node n1 = nodes.get(nd1);
        Node n2 = nodes.get(nd2);

        //verify correctness
        if (n1 == null || n2 == null) return;

        //setup
        q1.add(n1);
        q2.remove(n1);


        //cycle
        while (q1.size() > 0) {
            Node min = null;
            for (Node n : q1) {
                if (min == null || min.cachedDist > n.cachedDist) min = n;
            }

            if (min == n2) break;
            q0.add(min);
            q1.remove(min);
            for (Edge e : min.edges) {
                Node nn = e.otherEnd(min);
                if (q0.contains(nn)) continue;
                if (nn.cachedDist == 0 || nn.cachedDist > min.cachedDist + e.effectiveDist) {
                    nn.prevEdge = e;
                    nn.cachedDist = min.cachedDist + e.effectiveDist;
                }
                q1.add(nn);
            }
        }

    }


    public Node find(Node n, double maxdist) {
        return find(n.lon, n.lat, maxdist);
    }

    public Node find(double lon, double lat, double maxdist) {
        Node test = new Node(0, lon, lat);



        List<Node> res = nodes.entrySet().stream().map(e -> e.getValue()).filter(n -> (n.cachedDist = n.dist(test)) <= maxdist).collect(Collectors.toList());
//        for (Node n: res) {
//            n.cachedDist = n.realDist(test);
//        }
//                .map(n -> {n.cachedDist = n.realDist(test); return n;})
                //.filter(n -> n.cachedDist <= maxdist)
//                .collect(Collectors.toList());
        if (res.size() == 0) return null;

        Collections.sort(res);

        return res.get(0);
    }
}
