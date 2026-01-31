# Apache HTTP Server - HTTPS Configuration and Hardening

Securely configure Apache HTTP Server with HTTPS support and apply security hardening measures to mitigate known vulnerabilities identified through both static and dynamic analysis tools.

### Overview

This setup hardens the Apache HTTP Server Docker container (```httpd:trixie```) by enabling HTTPS, enforcing secure headers, restricting access, and addressing vulnerabilities identified through IriusRisk (static analysis) and OWASP ZAP (dynamic analysis).

### Mitigation Strategies

#### HTTPS Enablement

SSL/TLS is enabled through:

1. Generating a certificate and private key (`server.crt`, `server.key`) and moving them to `/usr/local/apache2/conf/`
2. Enabling SSL modules:
   - `mod_ssl` for TLS
   - `mod_socache_shmcb` for session caching
3. Including the SSL configuration file: `conf/extra/httpd-ssl.conf`
4. Exposing port 443 (HTTPS) only (port 80 is not exposed)

#### CWE Mapping (Apache HTTP Server)

| Countermeasure type | CWE | CWE title |
| --- | --- | --- |
| Proper permission management for ServerRoot | CWE-732 | Incorrect Permission Assignment for Critical Resource |
| Secure CGI script and module management | CWE-434 | Unrestricted Upload of File with Dangerous Type |
| Implement log monitoring and analysis | CWE-223 | Omission of Security-relevant Information |
| Network-based DoS mitigation | CWE-400 | Uncontrolled Resource Consumption |

#### CWE-732: Incorrect Permission Assignment for Critical Resource

**Description**: Incorrect permissions on critical files or directories can allow unauthorized access or modification.

**Mitigation**:
- Deny access to the filesystem root with `Require all denied`
- Allow access only to the document root (`/usr/local/apache2/htdocs`) with `Require all granted`
- Disable `.htaccess` overrides with `AllowOverride None`
- Block access to hidden files such as `.htaccess` and `.htpasswd`

#### CWE-434: Unrestricted Upload of File with Dangerous Type

**Description**: Uploading or executing dangerous file types can lead to arbitrary code execution.

**Mitigation**:
- CGI-related modules are disabled (`mod_cgi`, `mod_cgid` are not loaded)
- No `AddHandler cgi-script` is enabled for arbitrary extensions
- PHP modules are not present in the container by default

#### CWE-223: Omission of Security-relevant Information

**Description**: Missing or insufficient logging weakens detection and incident response.

**Mitigation**:
- Error logs and access logs are enabled (`ErrorLog`, `CustomLog`)
- Log level is set to `warn` to capture relevant events
- Container logs can be collected via Docker tooling or external log shippers

#### CWE-400: Uncontrolled Resource Consumption

**Description**: Unbounded resource usage can lead to denial of service.

**Mitigation**:
- `mod_reqtimeout` is loaded to mitigate slow request attacks
- Only the HTTPS endpoint is exposed to reduce the attack surface

#### Hardening for dynamic analysis (OWASP ZAP)

**Version information disclosure**:
- `ServerTokens Prod` and `ServerSignature Off` reduce version leakage

**Security headers** (in `httpd.conf` under `headers_module`):
- Content-Security-Policy (CSP)
- Strict-Transport-Security (HSTS)
- X-Frame-Options (anti clickjacking)
- X-Content-Type-Options (anti MIME sniffing)

**Cache-Control**:
- Cache-control directives are applied to HTML/PHP/CGI/PL/HTM responses:
  ```
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0
  Pragma: no-cache
  Expires: -1
  ```
