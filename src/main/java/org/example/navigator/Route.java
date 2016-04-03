package org.example.navigator;


import java.util.List;

public class Route extends Way {
    public final String shortName;
    public final String name;
    public final boolean isCircular;
    public Route(long id, String shortName, String name, boolean isCircular) {
        super(id);
        this.shortName = shortName;
        this.name = name;
        this.isCircular = isCircular;
    }


}
