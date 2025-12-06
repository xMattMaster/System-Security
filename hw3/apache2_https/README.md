# Apache HTTP Server - HTTPS Configuration and Hardening

Securely configure Apache HTTP Server with HTTPS support and apply security hardening measures to mitigate known vulnerabilities identified through both static and dynamic analysis tools.

### Overview

This configuration hardens the default Apache HTTP Server Docker container (```httpd:trixie```) by enabling HTTPS, implementing security headers, restricting access, and addressing vulnerabilities identified through static analysis (IriusRisk and OWASP ZAP).

### Mitigation Strategies

#### HTTPS Enablement

SSL/TLS support is enabled through:

1. Moving certificate files (`server.crt`, `server.key`) to `/usr/local/apache2/conf/`

2. Enabling SSL modules:
   - `mod_ssl` for SSL/TLS functionality
   - `mod_socache_shmcb` for SSL session caching

3. Including the SSL configuration file: `conf/extra/httpd-ssl.conf`

4. Exposing port 443 (HTTPS) instead of port 80 (HTTP)

5. Automatic HTTP-to-HTTPS redirection using `mod_rewrite`

#### CWE-16: Configuration

**Description**: Improper configuration settings can expose the web server to attacks.

**Mitigation**:
- Disabled all unnecessary modules by default
- Applied principle of least privilege: `AllowOverride None` in all directories to prevent `.htaccess` overrides
- Restricted directory access with `Require all denied` for sensitive paths
- Enabled access only to the document root (`/usr/local/apache2/htdocs`) with `Require all granted`

#### CWE-200: Exposure of Sensitive Information

**Description**: The server may leak version information through headers and error messages.

**Mitigation**:
- Set `ServerTokens Prod` to hide Apache version from HTTP headers
- Set `ServerSignature Off` to hide Apache signature from error pages
- Modified error and access log directives to avoid exposing internal paths

#### CWE-693: Protection Mechanism Failure

**Description**: Lack of proper security headers allows clickjacking and other attacks.

**Mitigation**:

Content Security Policy (CSP) header:
- Restricts script execution to same-origin only
- Prevents inline scripts and external resource loading
- Blocks framing with `frame-ancestors 'self'`

HTTP Strict-Transport-Security (HSTS) header:
- Enforces HTTPS for all connections (max-age=31536000)
- Includes subdomains and preload directive

X-Frame-Options header:
- Set to `DENY` to prevent clickjacking attacks

X-Content-Type-Options header:
- Set to `nosniff` to prevent MIME type sniffing

#### CWE-444: Inconsistent Interpretation of HTTP Requests

**Description**: Improper cache control allows browsers to cache sensitive content.

**Mitigation**:
- Applied strict cache-control headers to dynamic content (HTML, PHP, CGI, Perl):
  ```
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0
  Pragma: no-cache
  Expires: -1
  ```

#### CWE-250: Execution with Unnecessary Privileges

**Description**: Running as root unnecessarily increases attack surface.

**Mitigation**:
- Main process runs as root (required for port binding)
- Child worker processes run as unprivileged `www-data` user
- CGI/SSI modules are disabled by default to prevent privilege escalation
- If CGI is required, use `suEXEC` for privilege separation (see Apache documentation)

#### Logging and Monitoring

Both error and access logs are enabled:
- Error log captures warnings and critical events
- Access log records all HTTP requests
- Log paths can be customized for integration with monitoring tools (e.g., Filebeat via Docker volumes)

### Deployment

The configuration is deployed as a Docker container (`Dockerfile`) which ensures:
- Consistent, reproducible deployment
- Network isolation (only HTTPS port exposed)
- Easy integration with orchestration platforms

### References

- Apache HTTP Server Documentation: https://httpd.apache.org/docs/current/
- suEXEC Documentation: https://httpd.apache.org/docs/current/suexec.html
- OWASP Secure Headers Project: https://owasp.org/www-project-secure-headers/
- CWE/SANS Top 25: https://cwe.mitre.org/top25/