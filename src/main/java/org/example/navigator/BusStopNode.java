package org.example.navigator;

/**
 * Created by User on 4/3/2016.
 */
public class BusStopNode extends Node {
    public final String name;

    public BusStopNode(long id, double lon, double lat, String name) {
        super(id, lon, lat);
        this.name = name;
    }


}
