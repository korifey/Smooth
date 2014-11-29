package org.example.navigator.obstacle;

import org.example.navigator.Obstacle;
import org.example.navigator.OsmParser;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


/**
 * Created by Dmitry.Ivanov on 10/25/2014.
 */
public class ObstacleAllServlet extends HttpServlet {

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        for (Obstacle obstacle: OsmParser.INSTANCE.graph.allObstaclesSorted()) {
            resp.getOutputStream().println(obstacle.print());
        }
    }


    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
}
