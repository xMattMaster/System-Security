# Apache Tomcat - HTTPS Configuration and Hardening

Securely configure Apache Tomcat with HTTPS support and apply security hardening measures to mitigate known vulnerabilities identified through both static and dynamic analysis tools.

### Overview

This setup hardens the Apache Tomcat Docker container (```tomcat:jre25-temurin-noble```) by enabling HTTPS, applying security filters, restricting access, and addressing vulnerabilities identified through IriusRisk (static analysis) and OWASP ZAP (dynamic analysis).

### Mitigation Strategies

#### HTTPS Enablement

HTTPS/TLS is enabled through:

1. Generating a PKCS#12 keystore with certificate and private key (`server.p12`)
2. Configuring the HTTPS connector on port 8443 in `server.xml`
3. Disabling the HTTP connector on port 8080

#### CWE Mapping (Tomcat)

| Countermeasure type | CWE | CWE title |
| --- | --- | --- |
| Implement strict file permissions | CWE-276 | Incorrect Default Permissions |
| Run Tomcat under a dedicated non-root user | CWE-250 | Execution with Unnecessary Privileges |
| Secure JMX connections | CWE-345 | Insufficient Verification of Data Authenticity |
| Utilize firewalls and restrict network connections | CWE-693 | Protection Mechanism Failure |

#### CWE-345: Insufficient Verification of Data Authenticity

**Description**: Remote JMX access without authentication/encryption can enable unauthorized administrative actions.

**Mitigation**:
- `setenv.sh` enables remote JMX with SSL/TLS and authentication
- Credentials are defined in `jmxremote.password` and `jmxremote.access`
- The `server.p12` keystore encrypts the management channel

#### CWE-276: Incorrect Default Permissions

**Description**: Overly permissive defaults allow reading or modifying sensitive files.

**Mitigation**:
- `Dockerfile` applies restrictive `chmod` and `chown` to `jmxremote.password` and `server.p12`
- Permissions on `/usr/local/tomcat` are limited to reduce attack surface

#### CWE-250: Execution with Unnecessary Privileges

**Description**: Running Tomcat with elevated privileges amplifies the impact of vulnerabilities.

**Mitigation**:
- `Dockerfile` creates a dedicated `tomcat` user
- The container runs Tomcat as non-root (`USER tomcat`)
- The shutdown port is disabled (`port="-1"` in `server.xml`)

#### CWE-693: Protection Mechanism Failure

**Description**: Missing or incomplete protections increase exposure to attacks.

**Mitigation**:
- Only required ports are exposed: 8443 (HTTPS) and 8075 (JMX)
- The HTTP connector is disabled and network surface is reduced at the Docker level

#### Hardening for dynamic analysis (OWASP ZAP)

**Sensitive information removal**:
- In `server.xml`, `ErrorReportValve` disables `showReport` and `showServerInfo`
- In `web.xml`, the DefaultServlet sets `showServerInfo` to `false`

**Security headers** (in `web.xml` via `HttpHeaderSecurityFilter`):
- HSTS (`Strict-Transport-Security`)
- Anti clickjacking (`X-Frame-Options: DENY`)
- Anti MIME sniffing (`X-Content-Type-Options: nosniff`)

**CSP and Cache-Control**:
- Custom filters in `csp-1.0.jar` (`CSPPoliciesApplier`, `CacheControlValue`)
- Apply CSP and cache directives to all responses
