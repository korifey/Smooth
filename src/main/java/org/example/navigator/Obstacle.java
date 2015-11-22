package org.example.navigator;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Dmitry.Ivanov on 11/23/2014.
 */
public class Obstacle extends Node {

    public static final double AoeDistanceToEdge = 20; //in meters
    public static final double MaxDistanceToEdge = 50; //in meters

    private static int idGen = 0;

    public final boolean isDistanceBlocking;
    public final List<Edge> nearEdges = new ArrayList<>();

    public Obstacle(double lon, double lat, boolean isAoeBlocking) {
        super(++idGen, lon, lat);
        this.isDistanceBlocking = isAoeBlocking;
    }

    public String print() {
        return id+ " " + printCoords();
    }
}
