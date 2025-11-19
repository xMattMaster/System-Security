# Homework 1 – Exercise 4: Certificates

In this exercise, we issue and manage a simple X.509 v3 certificate chain, consisting of a root Certification Authority and an end user. We also export the certificate and the private key to a PKCS#12 keystore, and import it into the local keystore using *keytool*.

1.  Generate an asymmetric key pair of length 4096 for the CA to use with RSA

    ```bash
    ~$ openssl genpkey -algorithm rsa \
         -pkeyopt rsa_keygen_bits:4096 \
         -out ca_private.pem
    ```

2.  Create a self-signed X.509 v3, used as root certificate

    ```bash
    ~$ openssl req -x509 -new -key ca_private.pem \
         -subj "/O=Certification Authority S.p.A/CN=Certification Authority S.p.A./C=IT/L=Naples" \
         -days 365 \
         -addext "keyUsage = critical, cRLSign, keyCertSign" \
         -out ca_certificate.crt
    ```

3.  Generate an asymmetric key pair of length 4096 for the end user to use with RSA

    ```bash
    ~$ openssl genpkey -algorithm rsa \
         -pkeyopt rsa_keygen_bits:4096 \
         -out alice_private.pem
    ```

4.  Create the user’s PKCS#10 certificate signing request

    ```bash
    ~$ openssl req -new -key alice_private.pem \
         -subj "/O=Universita' degli Studi di Napoli \"Federico II\"/CN=Alice/C=IT/L=Naples" \
         -out alice_request.csr
    ```

5.  Issue a X.509 v3 certificate starting from the certificate signing request

    ```bash
    ~$ openssl req -in alice_request.csr \
         -CA ca_certificate.crt \
         -CAkey ca_private.pem \
         -days 365 \
         -addext "basicConstraints=critical, CA:false" \
         -addext "keyUsage = critical, digitalSignature, nonRepudiation, keyEncipherment" \
         -copy_extensions none \
         -out alice_certificate.crt
    ```

6.  Export the certificate and private key to PKCS#12

    ```bash
    ~$ openssl pkcs12 -export \
         -inkey ca_private.pem \
         -in ca_certificate.crt \
         -password "pass:arneseconte" \
         -name "Certification Authority S.p.A." \
         -out ca_certificate.p12
    ```

7.  Import the PKCS#12 keystore with Keytool

    ```bash
    ~$ keytool -importkeystore \
         -srckeystore ca_certificate.p12 \
         -srcstorepass "arneseconte"
    ```
