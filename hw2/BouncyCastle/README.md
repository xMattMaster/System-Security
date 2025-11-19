# Homework 2 - Exercise 2: Bouncy Castle

### Assignment

- Use Bouncy Castle to support advanced operations on certificates and signatures (CMS/PKCS#7).
- Generate X.509 v3 certificates with extensions and manage certificate chains.
- Perform CMS signing and verification on sample files.

### Solution

This project uses Bouncy Castle as a provider for operations that are complex or not directly exposed by JCA:

1. Provider setup
    - Register the Bouncy Castle provider to use its advanced APIs.

2. Certificate generation
    - Create a CA, generate end-entity X.509 v3 certificates with extensions (basicConstraints, keyUsage).

3. Keystore and PKCS#12
    - Export/import keys and certificates in PKCS#12 format.

4. CMS / PKCS#7
    - Create and verify CMS signatures (detached/attached) on sample files (artifacts available in the folder, e.g., hamlet.pdf.p7s / hamlet.pdf.sig).

5. Chain and signature verification
    - Read and validate certificate chains and signatures using the org.bouncycastle.cert and org.bouncycastle.cms classes.
