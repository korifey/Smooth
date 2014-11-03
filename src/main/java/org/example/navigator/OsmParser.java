package org.example.navigator;

import org.xml.sax.Attributes;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import javax.xml.parsers.*;
import java.io.BufferedReader;
import java.io.InputStreamReader;

/**
 * Created by Dmitry.Ivanov on 10/25/2014.
 */
public class OsmParser {

    public static OsmParser INSTANCE = new OsmParser();

    public final Graph graph;

    {
        graph = Parse("spb.osm");
    }

    private static void PrecomputedWays(Graph g) {
        double maxdist = 100.0;
        long idGen = 1000;
        Node[] ns = new Node[] {
                g.find(30.31381130218506, 59.93677096793883, maxdist),
                g.find(30.318070650100708, 59.93628993163026, maxdist),
                g.find(30.324411392211914, 59.935521333998, maxdist),
                g.find(30.332661867141724, 59.93448934273029, maxdist),
                g.find(30.335065126419067, 59.934188339228506, maxdist)
        };

        Way nevskyBus = new Way(++idGen);
        nevskyBus.roadType = RoadType.BUS;

        for (Node n: ns) {
            nevskyBus.nodes.add(n);

        }
        nevskyBus.finish();
        g.addWay(nevskyBus);
    }

    public static class MySaxHandler extends DefaultHandler {

        Graph res;
        Way enclosingWay = null;
        boolean enclosingWayIsHighway;

        @Override
        public void startDocument() throws SAXException {
            res = new Graph();
        }

        @Override
        public void endDocument() throws SAXException {
            res.finishLoading();
            PrecomputedWays(res);
        }

        @Override
        public void startElement(String uri, String localName, String qName, Attributes attributes) throws SAXException {
            switch (qName) {
                case "node":
                    String id = attributes.getValue("id");
                    String lon = attributes.getValue("lon");
                    String lat = attributes.getValue("lat");

                    long _id = Long.parseLong(id);
                    double _lon = Double.parseDouble(lon);
                    double _lat = Double.parseDouble(lat);

                    Node node = new Node(_id, _lon, _lat);
                    res.addNode(node);

                    break;

                case "way":
                    if (enclosingWay != null) throw new IllegalStateException("<way>: enclosing way != null");
                    _id = Long.parseLong(attributes.getValue("id"));
                    enclosingWay = new Way(_id);
                    enclosingWayIsHighway = false;
                    break;

                case "nd":
                    if (enclosingWay == null) throw new IllegalStateException("<nd>: enclosing way == null");
                    long ndId = Long.parseLong(attributes.getValue("ref"));
                    enclosingWay.nodes.add(res.nodes.get(ndId));
                    break;

                case "tag":
                    if (enclosingWay == null) return;
                    if (attributes.getValue("k").equals("highway")) {
                        enclosingWayIsHighway = true;

                        if (attributes.getValue("v").equals("footway") || attributes.getValue("v").equals("pedestrian")) {
                            enclosingWay.roadType = RoadType.PEDESTRIAN;
                        }
                    }

                default:
                    return;
            }

        }

        @Override
        public void endElement(String uri, String localName, String qName) throws SAXException {
            switch (qName) {

                case "way":
                    if (enclosingWay == null) throw new IllegalStateException("</way>: enclosing way == null");
                    if (!enclosingWayIsHighway) {
                        enclosingWay = null;
                        break;
                    }

                    enclosingWay.finish();
                    res.addWay(enclosingWay);
                    enclosingWay = null;

                    break;

                default:
                    return;
            }
        }
    }


    public static Graph Parse(String filePath) {

        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(OsmParser.class.getClassLoader().getResourceAsStream(filePath)));
            SAXParserFactory spf = SAXParserFactory.newInstance();
            spf.setNamespaceAware(false);
            SAXParser saxParser = spf.newSAXParser();

            MySaxHandler parser = new MySaxHandler();
            saxParser.parse(new InputSource(reader), parser);
            return parser.res;

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }



}
