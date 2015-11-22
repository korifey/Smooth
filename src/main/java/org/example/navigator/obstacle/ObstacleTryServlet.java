package org.example.navigator.obstacle;

import org.example.navigator.Obstacle;
import org.example.navigator.OsmParser;
import org.example.navigator.Path;
import org.example.navigator.Way;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintStream;


/**
 * Created by Dmitry.Ivanov on 10/25/2014.
 */
public class ObstacleTryServlet extends HttpServlet {

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        Obstacle o = ObstacleAddServlet.parseObstacle(req, resp);
        if (o == null) return;

        Way w = OsmParser.INSTANCE.graph.findClosestPedestrian(o).orElse(null);

        if (w != null) {
            new Path(w).print(new PrintStream(resp.getOutputStream()));
        }
    }


    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
}
