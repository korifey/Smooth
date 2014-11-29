package org.example.navigator.obstacle;

import org.example.navigator.Obstacle;
import org.example.navigator.OsmParser;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;


/**
 * Created by Dmitry.Ivanov on 10/25/2014.
 */
public class ObstacleGetServlet extends HttpServlet {

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        String _id = null;
        long id;
        try {
            _id = req.getParameter("id");
            if (_id == null) {
                resp.getOutputStream().println("error: 'id' parameter doesn't exist");
                return;
            }
            id = Long.parseLong(_id.trim());
        } catch (NumberFormatException e) {
            resp.getOutputStream().println("error: can't parse parameter 'id': "+_id);
            return;
        }

        Obstacle obstacle = OsmParser.INSTANCE.graph.getObstacle(id);
        if (obstacle == null) resp.getOutputStream().println("error: can't find obstacle by id: "+id);
        else resp.getOutputStream().println(obstacle.print());
    }


    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
}
