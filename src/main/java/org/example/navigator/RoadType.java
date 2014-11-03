package org.example.navigator;

/**
 * Created by Dmitry.Ivanov on 10/26/2014.
 */
enum RoadType {
    PEDESTRIAN (1, 1.0),
    ROAD (2, 1.3),
    BUS (3, 0.4);

    int typeId;
    double coeff;

    RoadType(int typeId, double coeff) {
        this.typeId = typeId;
        this.coeff = coeff;
    }
}

