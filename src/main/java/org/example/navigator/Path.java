package org.example.navigator;

import org.example.navigator.Edge;

import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Stream;

/**
 * Created by Dmitry.Ivanov on 1/26/2015.
 */
public class Path {
    public List<Edge> edges = new ArrayList<>();

    public Path() {
    }

    public Path(Way way) {
        edges.addAll(way.edges);
    }

    public Stream<Node> nodes() {
        if (edges.size() == 0) return Stream.empty();
        return Stream.concat(Stream.of(edges.get(0).start), edges.stream().map(e -> e.end));
    }

    public void print(PrintStream out) {

        HashMap<RoadType, Double> dist = new HashMap<>();
        for (RoadType rt: RoadType.values()) dist.put(rt, 0.0);

        if (edges.size() > 0) {
            Node start = edges.get(0).start;
            if (edges.size() > 1 && edges.get(1).contains(start)) {
                start = edges.get(0).otherEnd(start);
                assert !edges.get(1).contains(start);
            }
            final Node[] n = {start};

            edges.stream().forEach(e -> {
                out.print(n[0].printCoords());

                RoadType rt = e.way.roadType;
                out.println(" " + rt.typeId);
                dist.put(rt, dist.get(rt) + e.realDist);
                n[0] = e.otherEnd(n[0]);
            });
            out.println(n[0].printCoords());
        }

        out.print("dist: "+ Arrays.stream(RoadType.values()).map(rt -> Long.toString((long)(double)dist.get(rt))).reduce((str, l) -> str+" "+l).get());
        out.println();
    }
}
