# Homework 1 -Exercise 2: Asymmetric encryption to provide confidentiality

In this exercise, we simulate a simple secure communication scenario using a pre-shared asymmetric key. We use *RSA-4096* as the encryption algorithm.

1.  Generate an asymmetric key pair of length 4096 to use with RSA

    ```bash
    ~$ openssl genpkey -algorithm rsa \
         -pkeyopt rsa_keygen_bits:4096 \
         -out rsa_private.pem
    ```

2.  Extract the public key

    ```bash
    ~$ openssl rsa -in rsa_private.pem \
         -pubout \
         -out rsa_public.pem
    ```

3.  Encrypt the message with the recipient's public key, to provide confidentiality

    ```bash
    ~$ openssl pkeyutl -encrypt \
         -pubin \
         -inkey rsa_public.pem \
         -in message.txt \
         -out encrypted_message.bin
    ```

4.  Decrypt the message with the recipient's private key

    ```bash
    ~$ openssl pkeyutl -decrypt \
         -inkey rsa_private.pem \
         -in encrypted_message.bin \
         -out decrypted_message.txt
    ```
