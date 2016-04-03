package org.example.navigator;

import gnu.trove.map.hash.TLongObjectHashMap;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.InputStream;
import java.util.HashMap;
import java.util.logging.Logger;

/**
 * Created by User on 4/3/2016.
 */
public class RoutesParser {

    private static Logger logger = Logger.getLogger(RoutesParser.class.getName());
    public static RoutesParser INSTANCE = new RoutesParser();

    TLongObjectHashMap<Route> routes;
    public RoutesParser() {
        String path = "routes.xml";
        logger.info("Start parsing: "+path);
        routes = Parse(path);
    }

    private static String elemValue(Element parent, String child) {
        NodeList elementsByTagName = parent.getElementsByTagName(child);
        if (elementsByTagName.getLength() == 0) return null;
        return ((Element) elementsByTagName.item(0)).getTextContent();
    }


    public static TLongObjectHashMap<Route> Parse(String filePath) {
        TLongObjectHashMap<Route> res = new TLongObjectHashMap<>();
        try {
            InputStream is = RoutesParser.class.getClassLoader().getResourceAsStream(filePath);
            DocumentBuilderFactory df = DocumentBuilderFactory.newInstance();
            DocumentBuilder db = df.newDocumentBuilder();
            Document doc = db.parse(is);

            NodeList routes = doc.getDocumentElement().getElementsByTagName("route");
            for (int i=0; i<routes.getLength(); i++) {
                Element routeElem = (Element) routes.item(i);

                String elt_id = elemValue(routeElem, "id");

                Route route = new Route(
                         Long.parseLong(elt_id),
                    elemValue(routeElem, "shortName"),
                    elemValue(routeElem, "name"),
                    "1".equals(elemValue(routeElem, "circular"))
                );

                NodeList node_list = routeElem.getElementsByTagName("node_list");
                if (node_list.getLength() == 0) continue;

                NodeList nodes = ((Element)node_list.item(0)).getElementsByTagName("node");
                if (nodes.getLength() < 2) continue; //todo empty route

                for (int j=0; j<nodes.getLength(); j++) {
                    Element ndelt = (Element)nodes.item(j);
                    Node node;
                    if ("true".equals(ndelt.getAttribute("stop"))) {
                        node = new BusStopNode(
                                Long.parseLong(elemValue(ndelt, "id")),
                                Double.parseDouble(elemValue(ndelt, "lon")),
                                Double.parseDouble(elemValue(ndelt, "lat")),
                                elemValue(ndelt, "name")
                        );
                    } else {
                        node = new Node(0,
                                Double.parseDouble(elemValue(ndelt, "lon")),
                                Double.parseDouble(elemValue(ndelt, "lat"))
                                );
                    }
                    route.nodes.add(node);
                }


                route.finish();
                res.put(route.id, route); //todo route id can clash, node ids can clash
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return res;
    }
}
