Smooth
======

Map navigator for disabled people


======

To compile:

1. Install JDK from: http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
-- Verified jdk version is 1.8.0_25

2. Setup JAVA_HOME environment variable (must point to your jdk location)

3. Download Apache Maven binaries from http://maven.apache.org/download.cgi
-- Verified maven version is 3.2.3

4. Unpack maven somewhere and setup MAVEN_HOME and M2_HOME environment variables to point maven folder

5. Add $JAVA_HOME/bin and $M2_HOME/bin to your PATH environment variable

6. Cd to Smooth folder and type 'mvn clean package', Successful result is that target/smooth.war appear.

======

To run:

0. You can add jetty plugin to pom.xml and run it. Not implemented.

1. Download glassfish server from https://glassfish.java.net/download.html
--Verified server is glassfish-4.1

2. Unpack it somewhere, setup GLASSFISH_HOME env variable, add $GLASSFISH_HOME/bin to PATH

3. Start server: 'asadmin start-domain domain1'

4. Deploy app: navigate into Smooth folder and type 'asadmin deploy --name smooth target/smooth.war'

5. Go to 'localhost:8080/smooth'
