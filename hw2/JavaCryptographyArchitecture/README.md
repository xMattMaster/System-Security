# Homework 2 - Exercise 1: Java Cryptography Architecture

In this exercise, we implement the secure communication scenarios seen in Homework 1. We cover both the symmetric and asymmetric encryption cases, and then proceed to create a PGP-style encrypted package using both symmetric and asymmetric techniques.

### Solution

The Java project consists of a single file, ```App.java```, containing various functions that each implement one scenario.

#### ```symmetricEncryptionExample```

The function proceeds to:

1.  Generate a symmetric key using AES-256

2.  Initialize a Cipher for encryption

3.  Generate a random IV

4.  Encrypt the message

5.  Decrypt the message

#### ```asymmetricEncryptionExample```

The function proceeds to:

1.  Generate an asymmetric key pair using RSA-4096

2.  Initialize a Cipher for encryption

3.  Encrypt the message

4.  Decrypt the message

#### ```encryptedPackageExample```

The function proceeds to:

1.  Generate a symmetric key using AES-256

2.  Generate two asymmetric key pairs using RSA-4096

3.  Sign the message with Alice's private key

4.  Concatenate message and signature

5.  Encrypt the signed message with the symmetric key

6.  Encrypt the symmetric key with Bob's public key

7.  Create the encrypted package

8.  Once transmitted, split the package back into its components

9.  Decrypt the symmetric key with Bob's private key

10. Decrypt the signed message with the decrypted symmetric key

11. Separate the message and signature

12. Verify the signature with Alice's public key
