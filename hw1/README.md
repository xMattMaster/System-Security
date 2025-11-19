# Homework 1 - OpenSSL

### Assignment

- Generate symmetric keys and use them with different symmetric algorithms
- Generate asymmetric keys and use them to encrypt, sign data, and sign certificates
- Generate certificates according to the X.509 v3 standard
- Store the private key in PKCS#12 (.p12) and in a Java keystore using keytool (and later in Vault)

### Solution

The first part of the homework is treated in [Exercise 1](ex1_symmetric_encryption/README.md). We then use asymmetric encryption and decryption directly on the message (not the hash) in [Exercise 2](ex2_asymmetric_encryption/README.md). We implement a complete secure message transmission using both symmetric and asymmetric algorithms in [Exercise 3](ex3_encrypted_package/README.md). Finally, we create an example X.509 v3 certificate chain in [Exercise 4](ex4_certificates/README.md).
