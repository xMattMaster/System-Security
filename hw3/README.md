# Homework 3 - Apache/Tomcat HTTPS configuration

### Assignment

- Generate certificates for HTTPS.
- Securely configure Apache HTTP Server and Apache Tomcat (enable SSL and follow secure configuration best practices to eliminate known vulnerabilities).
- Analyze and mitigate vulnerabilities in the installed versions using public vulnerability catalogs (MITRE, CWE, OWASP).

### Solution

This assignment demonstrates the secure configuration of two web servers: Apache HTTP Server and Apache Tomcat. Both implementations follow industry best practices and address known vulnerabilities identified through both static analysis tools (IriusRisk, OWASP) and dynamic analysis tools (ZAP).

The solution consists of two main components:

- **Apache HTTP Server**: Configured with HTTPS support, security headers (CSP, HSTS, X-Frame-Options), proper access controls, and logging. See [apache2_https](apache2_https/README.md).

- **Apache Tomcat**: Hardened with encrypted JMX remote management, HTTPS support, security headers, custom filters for Content Security Policy and cache control, and disabled unnecessary features. See [tomcat_https](tomcat_https/README.md).

Both implementations are containerized using Docker for isolation and easier deployment.
