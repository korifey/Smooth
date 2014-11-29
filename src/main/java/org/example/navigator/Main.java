package org.example.navigator;


import java.io.IOException;
import java.io.PrintStream;
import java.util.Arrays;
import java.util.HashMap;

/**
 * Created by Dmitry.Ivanov on 10/25/2014.
 */
public class Main {
    public static void main(String[] args) {
//        Node __src = new Node(0, 30.31252384185791, 59.937472354745424);
//        Node __dst = new Node(0, 30.323853492736816, 59.93980482945983);

        Node __src = new Node(0, 30.31252384185791, 59.937472354745424);
        Node __dst = new Node(0, 30.335065126419067, 59.934188339228506);

        Graph graph = OsmParser.INSTANCE.graph;
        Node src = graph.find(__src, 100);
        System.out.println("__src:" + __src);
        System.out.println("src:" + src);

        Node dst = graph.find(__dst, 500);
        System.out.println("__dst:" + __dst);
        System.out.println("dst:"+dst);

        printDjikstra(graph, src, dst);


        graph.addObstacle(new Obstacle(30.3125342000,59.9371094000));

        printDjikstra(graph, src, dst);
        System.out.println((graph.allObstaclesSorted().toArray(new Obstacle[0])[0].print()));
    }

    public static void printDjikstra(Graph graph, Node src, Node dst) {
        graph.djikstra(src.id, dst.id);

        HashMap<RoadType, Double> dist = new HashMap<>();
        for (RoadType rt: RoadType.values()) dist.put(rt, 0.0);

        PrintStream out = System.out;

        dst.traversePrev(n -> {
            try {
                out.print(n.printCoords());
                if (n.prevEdge != null) {
                    RoadType rt = n.prevEdge.way.roadType;
                    out.println(" "+rt.typeId);
                    dist.put(rt, dist.get(rt) + n.prevEdge.realDist);
                }
                else out.println();
            } catch (Exception e) {}
        });

        out.print("dist: " + Arrays.stream(RoadType.values()).map(rt -> Long.toString((long) (double) dist.get(rt))).reduce((str, l) -> str + " " + l).get());
        out.println();
    }
}

