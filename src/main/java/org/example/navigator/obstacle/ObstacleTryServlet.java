package org.example.navigator.obstacle;

import org.example.navigator.*;

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

        Edge e = OsmParser.INSTANCE.graph.findClosestPedestrianEdge(o).orElse(null);

        if (e != null) {
            new Path(e).print(new PrintStream(resp.getOutputStream()));
        }
    }


    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
}
