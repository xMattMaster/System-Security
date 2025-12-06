FROM httpd:trixie
COPY httpd.conf /usr/local/apache2/conf/httpd.conf
COPY server.crt /usr/local/apache2/conf/server.crt
COPY server.key /usr/local/apache2/conf/server.key
RUN chmod 400 /usr/local/apache2/conf/server.key
EXPOSE 443
