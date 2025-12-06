# Homework 2 - Exercise 2: Bouncy Castle

In this exercise, we use Bouncy Castle to perform advanced cryptographic operations that are not directly available or are simplified through the standard JCA. We generate X.509 v3 certificates with custom extensions, manage certificate chains, and create CMS/PKCS#7 signatures. Lastly, we extract the fields of a X.509 V3 certificate.

### Solution

The Java project consists of a single file, ```App.java```, containing various functions that each implement one scenario.

#### ```certificateExample```

The function proceeds to:

1.  Generate two asymmetric key pairs using RSA-4096

2.  Create a new self-signed X.509 certificate for the CA

3.  Write the CA certificate to a PEM file

4.  Create a new X.509 certificate request for Alice

5.  Write the CSR to a PEM file

6.  Create a new X.509 certificate for Alice signed by the CA

7.  Write the CA certificate to a PEM file

8.  Create a P12 file containing CA's private key and certificate

9.  Save the P12 file

10. Create a P12 file containing Alice's private key and certificate chain

11. Save the P12 file

12. Sign a PDF using Alice's private key from the P12 file

13. Verify the PDF signature using Alice's certificate

14. Sign the PDF using CMS

15. Verify the CMS signature

#### ```extractCertInfo```

The function proceeds to:

1.  Load Alice's certificate

2.  Extract and print certificate information
