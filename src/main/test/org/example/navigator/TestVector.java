package org.example.navigator;

import org.junit.Assert;
import org.junit.Test;

/**
 * Created by Dmitry.Ivanov on 11/29/2014.
 */


public class TestVector {

    private void checkDist(Vector v, Vector v1, Vector v2, double referenceDist) {
        double dist1 = v.distToSegment1(v1, v2);
        double dist2 = v.distToSegment2(v1, v2);

        Assert.assertEquals(referenceDist, dist1, Vector.EPS);
        Assert.assertEquals(referenceDist, dist2, Vector.EPS);
    }

    @Test
    public void testDistTrivial() {
        //segment's ends are equal
        checkDist(new Vector(1, 0), new Vector(1, 0), new Vector(1, 0), 0);
        checkDist(Vector.ZERO, Vector.ZERO, Vector.ZERO, 0);
        checkDist(new Vector(2, 0), new Vector(1, 0), new Vector(1, 0), 1);
        checkDist(new Vector(3, 0), new Vector(1, 0), new Vector(1, 0), 2);
        checkDist(new Vector(0, 1), new Vector(1, 0), new Vector(1, 0), Math.sqrt(2));

        checkDist(Vector.ZERO, Vector.ZERO, new Vector(1, 0), 0);
        checkDist(Vector.ZERO, new Vector(1, 0), Vector.ZERO, 0);
        checkDist(new Vector(1, 0), new Vector(1, 0), Vector.ZERO, 0);

        checkDist(new Vector(1, -1), new Vector(1, -1), Vector.ZERO, 0);
        checkDist(new Vector(1, -1), Vector.ZERO, new Vector(1, -1), 0);
        checkDist(Vector.ZERO, Vector.ZERO, new Vector(1, -1), 0);
    }

    @Test
    public void testDistCollinear() {
        checkDist(new Vector(-1, 0), new Vector(1, 0), Vector.ZERO, 1);
        checkDist(new Vector(-2, 0), new Vector(1, 0), Vector.ZERO, 2);
        checkDist(new Vector(0.5, 0), new Vector(1, 0), Vector.ZERO, 0);
        checkDist(new Vector(0.7, 0), new Vector(1, 0), Vector.ZERO, 0);
        checkDist(new Vector(1.1, 0), new Vector(1, 0), Vector.ZERO, 0.1);

        checkDist(Vector.ZERO, new Vector(1, 1), new Vector(-2, -2), 0);
        checkDist(new Vector(-1, -1), new Vector(1, 1), new Vector(-2, -2), 0);
        checkDist(new Vector(2, 2), new Vector(1, 1), new Vector(-2, -2), Math.sqrt(2));
        checkDist(new Vector(-10, -10), new Vector(1, 1), new Vector(-2, -2), Math.sqrt(2)*8);
    }

    @Test
    public void testDistOutOfBoundingBox() {
        checkDist(new Vector(0, 1), new Vector(1, 0), Vector.ZERO, 1);
        checkDist(new Vector(0, -2), new Vector(1, 0), Vector.ZERO, 2);
        checkDist(new Vector(2, 1), new Vector(1, 0), Vector.ZERO, Math.sqrt(2));
        checkDist(new Vector(0, -1), new Vector(1, 1), Vector.ZERO, 1);
    }

    @Test
    public void testDistNormal() {
        checkDist(new Vector(0.5, 0.5), new Vector(1, 0), Vector.ZERO, 0.5);
        checkDist(new Vector(0.7, -0.8), new Vector(1, 0), Vector.ZERO, 0.8);

        checkDist(new Vector(0.5, 5), new Vector(10, 0), new Vector(-10, 0), 5);
        checkDist(new Vector(5.5, -5), new Vector(10, 0), new Vector(-10, 0), 5);

        checkDist(new Vector(-1, 0), new Vector(-1, -1), new Vector(1, 1), Math.sqrt(2)/2);
        checkDist(new Vector(-1, 1), new Vector(-1, -1), new Vector(1, 1), Math.sqrt(2));
    }

}
