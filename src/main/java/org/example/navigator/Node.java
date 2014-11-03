package org.example.navigator;

import java.util.ArrayList;
import java.util.function.Consumer;

/**
* Created by Dmitry.Ivanov on 10/26/2014.
*/
public class Node implements Comparable<Node> {

    public int concomp;

    public final long id;
    public final double lon;
    public final double lat;

    double cachedDist;

    ArrayList<Edge> edges = new ArrayList<>();
    ArrayList<Way> insideWays = new ArrayList<>();

    Edge prevEdge;


    public Node(long id, double lon, double lat) {
        this.id = id;
        this.lon = lon;
        this.lat = lat;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Node node = (Node) o;

        if (id != node.id) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return (int)id;
    }

    public double dist(Node n) {
        return Util.distByCoord(lon, lat, n.lon, n.lat);
    }

    @Override
    public int compareTo(Node node) {
        return Double.compare(cachedDist, node.cachedDist);
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
