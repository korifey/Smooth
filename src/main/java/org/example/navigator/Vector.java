package org.example.navigator;

/**
 * Created by Dmitry.Ivanov on 11/23/2014.
 */
public class Vector {

    public static final double EPS = 0.1;
    public static final Vector ZERO = new Vector(0, 0);


    public final double x;
    public final double y;

    public Vector(double x, double y) {
        this.x = x;
        this.y = y;
    }

    public double dist2(Vector v) {
        return Util.sqr((x - v.x)) + Util.sqr((y - v.y));
    }
    public double dist(Vector v) {
        return Math.sqrt(dist2(v));
    }

    boolean isZero() {
        return dist2(ZERO) < EPS;
    }

    public Vector add(Vector v) {
        return new Vector(x + v.x, y + v.y);
    }

    public Vector sub(Vector v) {
        return new Vector(x - v.x, y - v.y);
    }

    public Vector mul(double a) {
        return new Vector(x * a, y* a);
    }

    public double abs() {
        return Math.sqrt(abs2());
    }

    public double abs2() {
        return dot(this);
    }

    public boolean same(Vector v) {
        return sub(v).isZero();
    }

    public Vector norm() {
        if (isZero()) return ZERO;
        double abs = abs();
        return new Vector(x / abs, y/abs);
    }

    public double dot(Vector v) {
        return x*v.x+y*v.y;
    }

    public double cross(Vector v) {
        return x*v.y - y*v.x;
    }

    public static boolean eq(double x, double y) {
        return Math.abs(x - y) < EPS;
    }

    public static boolean gt(double x, double y) {
        return x - y > EPS;
    }

    public boolean inBoundingBox(Vector v1, Vector v2) {
        return x >= Math.min(v1.x, v2.x)
               && x <= Math.max(v1.x, v2.x)
               && y >= Math.min(v1.y, v2.y)
               && y <= Math.max(v1.y, v2.y);
    }

    public double distToSegment1(Vector v1, Vector v2) {
        if (v1.same(v2)) return dist(v1);

        Vector v = this.sub(v1);
        Vector p = v2.sub(v1).norm();

        Vector proj = p.mul(v.dot(p)).add(v1);
        if (proj.inBoundingBox(v1, v2)) {
            return sub(proj).abs();
        } else {
            return Math.min(dist(v1), dist(v2));
        }
    }

    public double distToSegment2(Vector v1, Vector v2) {
        if (v1.same(v2)) return dist(v1);

        Vector v = this.sub(v1);
        Vector p = v2.sub(v1);

        double dot = v.dot(p);
        double pabs2 = p.abs2();
        if (gt(0, dot) || gt(dot, pabs2)) {
            return Math.min(dist(v1), dist(v2));
        } else {
            return Math.abs(v.cross(p)/Math.sqrt(pabs2));
        }
    }

    //return 0<= alpha <= 1, such as closestVector = v1*(1-alpha) + v2*alpha
    public double closestPointInSegment(Vector v1, Vector v2) {
        if (v1.same(v2)) return dist(v1);

        Vector v = this.sub(v1);
        Vector p = v2.sub(v1).norm();

        Vector proj = p.mul(v.dot(p)).add(v1);
        if (proj.inBoundingBox(v1, v2)) {
            return Math.abs(v2.x - v1.x) > EPS ?
                    (proj.x - v1.x) / (v2.x - v1.x)
                    : (proj.y - v1.y) / (v2.y - v1.y);
        } else {
            return dist(v1) <  dist(v2) ? 0 : 1;
        }
    }

    @Override
    public String toString() {
        return "Vector{" +
                "x=" + x +
                ", y=" + y +
                '}';
    }
}
