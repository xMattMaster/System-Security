# Homework 2 - Exercise 1: Java Cryptography Architecture

### Assignment

- Re-implement the OpenSSL exercises using only JCA native APIs.
- Generate symmetric (AES) and asymmetric (RSA-4096) keys.
- Encrypt/decrypt data and sign/verify signatures.
- Parse X.509 certificate fields and manage keystores (PKCS#12, JKS).

### Solution

Questo progetto mostra l'uso di JCA per svolgere le attività richieste:

1. Key generation
   - AES keys via javax.crypto.KeyGenerator.
   - RSA-4096 via java.security.KeyPairGenerator.

2. Symmetric encryption / decryption
   - javax.crypto.Cipher (es. AES/CBC/PKCS5Padding) per cifrare e decifrare file di esempio.

3. Digital signatures
   - java.security.Signature (es. SHA256withRSA) per firmare e verificare digest.

4. Asymmetric operations
   - Operazioni RSA (es. RSA/OAEP) tramite Cipher quando necessario.

5. Certificate handling
   - Parsing e lettura di X.509 con CertificateFactory e java.security.cert.X509Certificate.

6. Keystore management
   - Uso di java.security.KeyStore per caricare/salvare PKCS#12 e JKS.
