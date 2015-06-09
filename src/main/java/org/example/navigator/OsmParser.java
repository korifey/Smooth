package org.example.navigator;

import org.xml.sax.Attributes;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import javax.xml.parsers.*;
import java.io.*;
import java.util.Collections;
import java.util.logging.Logger;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/**
 * Created by Dmitry.Ivanov on 10/25/2014.
 */
public class OsmParser {

    private static Logger logger = Logger.getLogger(OsmParser.class.getName());
    public static OsmParser INSTANCE = new OsmParser();

    public Graph graph;

    {
        String path = "spb-full.zip";
        logger.info("Start parsing: "+path);
        graph = Parse(path);
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

        Collections.addAll(nevskyBus.nodes, ns);
        nevskyBus.finish();
        g.addWay(nevskyBus);
        logger.info("Added precomputed way: nevskyBus");
    }

    public static class MySaxHandler extends DefaultHandler {

        Graph res;
        Way enclosingWay = null;
        boolean enclosingWayIsHighway;
        private int badNodes;

        @Override
        public void startDocument() throws SAXException {
            logger.info("SAXParser.startDocument()");
        }

        @Override
        public void endDocument() throws SAXException {
            res.removeUnconnectedComponents();
        }

        @Override
        public void startElement(String uri, String localName, String qName, Attributes attributes) throws SAXException {
            switch (qName) {
                case "bounds":
                    double minlon = Double.parseDouble(attributes.getValue("minlon"));
                    double minlat = Double.parseDouble(attributes.getValue("minlat"));
                    double maxlon = Double.parseDouble(attributes.getValue("maxlon"));
                    double maxlat = Double.parseDouble(attributes.getValue("maxlat"));

                    res = new Graph(minlon, minlat, maxlon, maxlat);
                    break;
                case "node":
                    String id = attributes.getValue("id");
                    String lon = attributes.getValue("lon");
                    String lat = attributes.getValue("lat");

                    long _id = Long.parseLong(id);
                    double _lon = Double.parseDouble(lon);
                    double _lat = Double.parseDouble(lat);

                    Node node = new Node(_id, _lon, _lat);
                    res.addNode(node, false);

                    break;

                case "way":
                    if (enclosingWay != null) throw new IllegalStateException("<way>: enclosing way != null");
                    if (attributes.getValue("foot").equals("no")) break;
                    _id = Long.parseLong(attributes.getValue("id"));
                    enclosingWay = new Way(_id);
                    enclosingWayIsHighway = false;
                    break;

                case "nd":
                    if (enclosingWay == null) throw new IllegalStateException("<nd>: enclosing way == null");
                    long ndId = Long.parseLong(attributes.getValue("ref"));
                    Node n = res.nodes.get(ndId);
                    if (n != null)
                        enclosingWay.nodes.add(n);
                    else
                        badNodes++;
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
            String binaryPath = filePath + ".bin";
            File binary = new File(binaryPath);
            File osm = new File(filePath);

            final Graph res;
            if (!binary.exists() || (osm.exists() && osm.lastModified() >= binary.lastModified())) {
                InputStream is = OsmParser.class.getClassLoader().getResourceAsStream(filePath);
                if (filePath.endsWith(".zip")) {
                    ZipInputStream zis = new ZipInputStream(new BufferedInputStream(is, 100000));
                    ZipEntry ze;
                    while ((ze = zis.getNextEntry()) != null) {
                        if (ze.getName().endsWith(".osm")) {
                            is = zis;
                            break;
                        }
                    }
                }
                BufferedReader reader = new BufferedReader(new InputStreamReader(is));
                SAXParserFactory spf = SAXParserFactory.newInstance();
                spf.setNamespaceAware(false);
                SAXParser saxParser = spf.newSAXParser();

                MySaxHandler parser = new MySaxHandler();
                saxParser.parse(new InputSource(reader), parser);
                reader.close();

                res =  parser.res;

                logger.info("Graph constructed, serializing to '"+binary.getAbsolutePath()+"'");
                try (DataOutputStream os = new DataOutputStream(new BufferedOutputStream(new FileOutputStream(binary)))) {
                    res.serialize(os);
                }
                return res;

            } else {
                logger.info("Deserializing graph from binary location: '"+binary.getAbsolutePath()+"'");
                try (DataInputStream is = new DataInputStream(new BufferedInputStream(new FileInputStream(binary)))) {
                    res = Graph.deserialize(is);
                }
            }

            logger.info("Initialization complete");
            return  res;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }



}
