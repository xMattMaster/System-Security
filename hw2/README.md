# Homework 2 - Java Cryptography Architecture

### Assignment

- The same exercises as in OpenSSL, certificates management
- Issue X.509 certificates and a certificate chain.
- Sign and verify data
- Extract the fields from a certificate (e.g. subject, public key, expiration, key usage)


### Solution

The first part of OpenSSL exercises, specifically the ones regarding symmetric and asymmetric encryption, are treated only using JCA native functions. See the [JavaCryptographyArchitecture](JavaCryptographyArchitecture/README.md) Java project. The rest of the implementation uses [Bouncy Castle](https://www.bouncycastle.org/) as a supporting library. See the [BouncyCastle](BouncyCastle/README.md) Java project.
