FROM tomcat:jre25-temurin-noble
COPY server.xml /usr/local/tomcat/conf/server.xml
COPY server.p12 /usr/local/tomcat/conf/server.p12
COPY web.xml /usr/local/tomcat/conf/web.xml
COPY csp-1.0.jar /usr/local/tomcat/lib/csp-1.0.jar
RUN mkdir -p /usr/local/tomcat/webapps/ROOT
COPY index.html /usr/local/tomcat/webapps/ROOT/index.html
COPY logging.properties /usr/local/tomcat/conf/logging.properties
COPY jmxremote.password /usr/local/tomcat/conf/jmxremote.password
COPY jmxremote.access /usr/local/tomcat/conf/jmxremote.access
COPY setenv.sh /usr/local/tomcat/bin/setenv.sh
RUN groupadd -r tomcat && useradd -r -s /bin/false -g tomcat tomcat
RUN chown -R root:tomcat /usr/local/tomcat
RUN chown tomcat:tomcat /usr/local/tomcat/conf/jmxremote.password
RUN chmod -R 750 /usr/local/tomcat
RUN chmod 400 /usr/local/tomcat/conf/jmxremote.password
RUN chmod 440 /usr/local/tomcat/conf/server.p12
RUN chown -R tomcat:tomcat /usr/local/tomcat/logs
RUN chown -R tomcat:tomcat /usr/local/tomcat/temp
RUN chown -R tomcat:tomcat /usr/local/tomcat/webapps
USER tomcat
EXPOSE 8443
EXPOSE 8075