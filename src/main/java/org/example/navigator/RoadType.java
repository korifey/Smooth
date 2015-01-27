package org.example.navigator;

import java.util.Arrays;
import java.util.Comparator;

/**
 * Created by Dmitry.Ivanov on 10/26/2014.
 */
enum RoadType {
    PEDESTRIAN (1, 1.0),
    ROAD (2, 1.3),
    BUS (3, 0.5);

    int typeId;
    double coeff;

    RoadType(int typeId, double coeff) {
        this.typeId = typeId;
        this.coeff = coeff;
    }

    public static final double HeuristicsCoeff;
    static {
        HeuristicsCoeff = Arrays.stream(RoadType.values()).map(rt -> rt.coeff).min(Comparator.<Double>naturalOrder()).get();
    }
}

