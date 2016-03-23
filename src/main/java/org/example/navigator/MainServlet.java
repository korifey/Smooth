package org.example.navigator;

import java.io.*;
import java.util.*;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 * Created by Dmitry.Ivanov on 10/25/2014.
 */
public class MainServlet extends HttpServlet {

    private final double maxdist = 500;

    private Logger logger = Logger.getLogger(getClass().getName());

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ServletOutputStream out = resp.getOutputStream();
        logger.info(req.getRequestURI() + "?" + req.getQueryString());

        List<Double> lst = new ArrayList<>();
        for (Enumeration<String> en = req.getParameterNames(); en.hasMoreElements(); ) {
            String p = en.nextElement().trim();
            try {
                lst.add(Double.parseDouble(p));
            } catch (NumberFormatException e) {
                out.println("error: can't parse: " + p + "");
                return;
            }
        }
        if (lst.size() != 4) {
            out.println("error: incorrect number of parameters: " + lst.size() + ". Must be 4.");
            return;
        }

        double long1 = lst.get(0);
        double lat1 = lst.get(1);
        double long2 = lst.get(2);
        double lat2 = lst.get(3);

        Node __src = new Node(0, long1, lat1);
        Node __dst = new Node(0, long2, lat2);


        //OsmParser.INSTANCE.graph = OsmParser.Parse("spb-full.zip");
        Graph graph = OsmParser.INSTANCE.graph;

        Node src = null;
        Node dst = null;

        try {
            src = graph.findNodeOrEdge(__src, maxdist);
            dst = graph.findNodeOrEdge(__dst, maxdist);

            if (src == null) {
                out.println("error: can't find start point");
                return;
            }

            if (dst == null) {
                out.println("error: can't find destination point");
                return;
            }

            if (src == dst) {
                out.println("error: source == destination");
                return;
            }

            Path path = graph.aStar(src, dst);
            path.print(new PrintStream(out));

        } finally {
            graph.clear();
            if (src instanceof EdgeNode) ((EdgeNode) src).close();
            if (dst instanceof EdgeNode) ((EdgeNode) dst).close();
        }

    }


    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
}
