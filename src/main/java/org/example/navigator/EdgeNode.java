package org.example.navigator;

public class EdgeNode extends Node {
    final static long FakeId = -1;
    static long idGen = 0;

    private Edge edge;
    private double alpha;

    private Way fakeWay;

    public EdgeNode(Edge edge, double alpha) {
        super(++idGen,
                edge.start.lon * (1-alpha) + edge.end.lon * alpha,
                edge.start.lat * (1-alpha) + edge.end.lat * alpha);
        this.edge = edge;
        this.alpha = alpha;

        fakeWay = new Way(FakeId);
        fakeWay.roadType = RoadType.PEDESTRIAN;
        fakeWay.nodes.add(edge.start);
        fakeWay.nodes.add(this);
        fakeWay.nodes.add(edge.end);
        fakeWay.finish();
    }

    public static EdgeNode create(Node n, Edge e) {
        return new EdgeNode(e, n.vector().closestPointInSegment(e.start.vector(), e.end.vector()));
    }

    public void close() {
        edge.start.edges.removeAll(fakeWay.edges);
        edge.end.edges.removeAll(fakeWay.edges);
    }
}
