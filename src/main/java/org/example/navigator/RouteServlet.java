package org.example.navigator;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintStream;
import java.util.HashMap;
import java.util.logging.Logger;

/**
 * Created by User on 4/3/2016.
 */
public class RouteServlet extends HttpServlet {

    private Logger logger = Logger.getLogger(getClass().getName());

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }



    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ServletOutputStream out = resp.getOutputStream();
        logger.info(req.getRequestURI() + "?" + req.getQueryString());


        Long id;
        try {
            id = Long.parseLong(req.getParameter("id"));
        } catch (NumberFormatException e) {
            out.println("error, can't parse `id`");
            return;
        }

        HashMap<Long, Route> routes = RoutesParser.INSTANCE.routes;

        Route route = routes.get(id);
        if (route == null) {
            out.print("error, no such route: "+id);
            return;
        }

        Path path = new Path(route);
        path.print(new PrintStream(out));

    }
}
