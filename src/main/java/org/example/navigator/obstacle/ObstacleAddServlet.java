package org.example.navigator.obstacle;

import org.example.navigator.Obstacle;
import org.example.navigator.OsmParser;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;


/**
 * Created by Dmitry.Ivanov on 10/25/2014.
 */
public class ObstacleAddServlet extends HttpServlet {

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        List<Double> lst = new ArrayList<>();
        for (Enumeration<String> en = req.getParameterNames(); en.hasMoreElements(); ) {
            String p = en.nextElement().trim();
            try {
                lst.add(Double.parseDouble(p));
            } catch (NumberFormatException e) {
                resp.getOutputStream().println("error: can't parse: " + p + "");
                return;
            }
        }
        if (lst.size() != 2) {
            resp.getOutputStream().println("error: incorrect number of parameters: " + lst.size() + ". Must be 2.");
            return;
        }

        double lon = lst.get(0);
        double lat = lst.get(1);

        Obstacle obstacle = new Obstacle(lon, lat);
        OsmParser.INSTANCE.graph.addObstacle(obstacle);
        resp.getOutputStream().println(obstacle.print());
    }


    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
}
