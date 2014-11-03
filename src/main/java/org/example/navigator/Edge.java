package org.example.navigator;

/**
 * Created by Dmitry.Ivanov on 10/26/2014.
 */
public class Edge {
    public Way way;
    public Node start;
    public Node end;

    public double realDist;
    public double effectiveDist;

    public Edge(Way way, Node start, Node end) {
        this.way = way;
        this.start = start;
        this.end = end;

        realDist = start.dist(end);
        effectiveDist = realDist*way.roadType.coeff;
    }

    public Node otherEnd(Node n) {
        if (!start.equals(n) && !end.equals(n)) throw new IllegalStateException("bad node "+n.id+"for edge "+start.id+"->"+end.id+" in way"+way.id);
        if (!start.equals(n)) return start;
        return end;
    }
}
