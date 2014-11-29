package org.example.navigator;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Dmitry.Ivanov on 11/23/2014.
 */
public class Obstacle extends Node {

    public static final double DistanceToEdge = 20; //in meters

    private static int idGen = 0;

    public final List<Edge> nearEdges = new ArrayList<>();

    public Obstacle(double lon, double lat) {
        super(++idGen, lon, lat);
    }

    public String print() {
        return id+ " " + printCoords();
    }
}
