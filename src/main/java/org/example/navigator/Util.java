package org.example.navigator;

/**
 * Created by Dmitry.Ivanov on 10/25/2014.
 */
public class Util {
    public static double sqr(double x) {
        return x*x;
    }

    public static double distByCoord(double long1, double lat1, double long2, double lat2) {
        return Math.sqrt(sqr((long1-long2)*65555) + sqr((lat1-lat2)*111111));
    }
}
