package org.example.navigator;

import java.util.ArrayList;
import java.util.function.Consumer;

/**
* Created by Dmitry.Ivanov on 10/26/2014.
*/
public class Node {

    public int concomp;

    public final long id;
    public final double lon, lat;

    ArrayList<Edge> edges = new ArrayList<>();
    ArrayList<Way> insideWays = new ArrayList<>();

    //cached
    Edge prevEdge;
    double cachedDist;
    double heurictics;
    public int number;

    public void clearCached() {
        prevEdge = null;
        cachedDist = 0;
        heurictics = 0;
        number = 0;
    }

    public Node(long id, double lon, double lat) {
        this.lon = lon;
        this.lat = lat;
        this.id = id;
    }

    public double dist(Node n) {
        return vector().dist(n.vector());
    }

    public Vector vector() {
        return new Vector(65555*lon, 111111*lat);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Node node = (Node) o;

        return id == node.id;

    }

    @Override
    public int hashCode() {
        return (int)id;
    }

    public String printCoords() {
        return String.format("%.10f %.10f", lon, lat);
    }

    public String toString() {
        return String.format("id=%d lat=%.10f lon=%.10f cachedDist=%.2f", id, lon, lat, cachedDist);
    }

    public void traversePrev(Consumer<Node> consumer) {
        Node n = this;
        while (n != null) {
            consumer.accept(n);
            if (n.prevEdge == null) return;
            n = n.prevEdge.otherEnd(n);
        }
    }
}
