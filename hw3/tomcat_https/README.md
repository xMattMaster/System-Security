# Apache Tomcat - HTTPS Configuration and Hardening

Securely configure Apache Tomcat with HTTPS support and apply security hardening measures to mitigate known vulnerabilities identified through both static and dynamic analysis tools.

### Overview

This configuration hardens the default Apache Tomcat Docker container (```tomcat:jre25-temurin-noble```) by enabling HTTPS, implementing custom security filters, restricting access, disabling unnecessary features, and addressing vulnerabilities identified through IriusRisk and OWASP ZAP.

### Mitigation Strategies

#### HTTPS Enablement

HTTPS/TLS support is enabled through:

1. Generating a self-signed PKCS#12 keystore containing the server certificate and private key

2. Configuring the HTTPS connector on port 8443 in `server.xml` with the keystore reference

3. Disabling the default HTTP connector on port 8080

#### CWE-338: Use of Cryptographically Weak Pseudo-Random Number Generator

**Description**: Weak random number generation can compromise security tokens and session IDs.

**Mitigation**:
- JVM parameters in `setenv.sh` configure secure random number generation for TLS operations
- Tomcat's default secure random implementation is used for session token generation

#### CWE-770: Allocation of Resources Without Limits

**Description**: Unbounded resource allocation can lead to Denial of Service attacks.

**Mitigation**:
- The default `LockOutRealm` is enabled in `server.xml` to prevent brute-force authentication attacks
- Connection limits are enforced through Docker containerization

#### CWE-200: Exposure of Sensitive Information

**Description**: Version information disclosure via error pages and HTTP headers.

**Mitigation**:
- In `web.xml`: configured display-name and version hiding for Tomcat system pages (lines 144-145)
- Custom error handlers prevent version leakage in HTTP responses
- Server signature headers are suppressed

#### CWE-693: Protection Mechanism Failure

**Description**: Missing or weak security headers increase vulnerability to various attacks.

**Mitigation**:

Security headers implemented in `web.xml` (lines 515-541):

- **Strict-Transport-Security (HSTS)**: Enforces HTTPS for all connections (max-age=31536000)
- **X-Frame-Options**: Set to `DENY` to prevent clickjacking
- **Content-Security-Policy (CSP)**: Custom implementation via `CSPPoliciesApplier` filter and `csp-1.0.jar`
  - Restricts script execution to same-origin
  - Blocks inline scripts and external resource loading
- **X-Content-Type-Options**: Set to `nosniff` to prevent MIME type sniffing
- **Cache-Control**: Custom implementation via `CacheControlFilter` and `csp-1.0.jar`
  - Prevents caching of sensitive dynamic content

<!-- #### CWE-250: Execution with Unnecessary Privileges

**Description**: The product performs an operation at a privilege level that is higher than the minimum level required, which creates new weaknesses or amplifies the consequences of other weaknesses. -->

#### CWE-250: Execution with Unnecessary Privileges

**Description**: Running with more privileges than required increases attack surface.

**Mitigation**:
- Disabled the shutdown port (port 22) to prevent unauthorized server termination
- Enabled `SecurityListener` in `server.xml` (line 25) for security event monitoring
- Docker containerization restricts network access:
  - Only ports 8075 (JMX remote) and 8443 (HTTPS) are exposed
  - All other ports are blocked by the container network


<!-- #### CWE-345: Insufficient Verification of Data Authenticity

**Description**: The product does not sufficiently verify the origin or authenticity of data, in a way that causes it to accept invalid data. -->

#### CWE-522: Insufficiently Protected Credentials

**Description**: Unencrypted credential storage or transmission can lead to credential theft.

**Mitigation**:

JMX Remote Encryption (`setenv.sh` and `server.xml`):
- JMX remote management is secured with encrypted connections on port 8075
- Authentication credentials are defined in `jmxremote.password` and `jmxremote.access`
- Only authorized users can access JVM monitoring and management

Enhanced Logging (`logging.properties`):
- Detailed logging of TLS handshake operations: `org.apache.tomcat.util.net.NioEndpoint.handshake.level=FINE`
- Enables detection of authentication failures and TLS issues

#### Custom Security Filters

Two custom filters implement additional security measures:

1. **CSPPoliciesApplier** (in `csp-1.0.jar`):
   - Implements and applies Content-Security-Policy headers to all responses
   - Prevents inline script execution and XSS attacks

2. **CacheControlFilter** (in `csp-1.0.jar`):
   - Applies cache-control directives to prevent caching of sensitive content
   - Sets `no-store`, `no-cache`, `must-revalidate` for dynamic pages

Both filters are registered in `web.xml` (lines 546-558).

### Deployment

The configuration is deployed as a Docker container (see `Dockerfile`) which ensures:
- Isolated execution environment
- Network-level access control (only required ports exposed)
- Consistent, reproducible deployment
- Simplified integration with container orchestration platforms

### References

- Apache Tomcat Security Documentation: https://tomcat.apache.org/tomcat-9.0-doc/security-howto.html
- Tomcat Configuration Reference: https://tomcat.apache.org/tomcat-9.0-doc/config/
- OWASP Secure Headers Project: https://owasp.org/www-project-secure-headers/
- CWE/SANS Top 25: https://cwe.mitre.org/top25/
- Java Secure Socket Extension (JSSE): https://docs.oracle.com/javase/8/docs/technotes/guides/security/jsse/JSSERefGuide.html