# Homework 1 -Exercise 3: Encrypted package

In this exercise, we simulate a secure message exchange system using both symmetric and asymmetric encryption. The working scheme is the same used by PGP.

### Prerequisites

1.  Both parties have an asymmetric key pair of length 4096 to use with RSA

    ```bash
    ~$ openssl genpkey -algorithm rsa \
         -pkeyopt rsa_keygen_bits:4096 \
         -out alice_private.pem
    ~$ openssl rsa -in alice_private.pem \
         -pubout \
         -out alice_public.pem

    ~$ openssl genpkey -algorithm rsa \
         -pkeyopt rsa_keygen_bits:4096 \
         -out bob_private.pem
    ~$ openssl rsa -in bob_private.pem \
         -pubout \
         -out bob_public.pem
    ```

### Sending the message

1.  Generate a symmetric key of length 256 to use with AES for secure communication (assuming the key is pre-shared by the parties).

    ```bash
    ~$ openssl enc -aes-256-cbc \
         -k arneseconte -P \
         -md sha256 \
         -nosalt
    ```

2.  Sign the message's digest (SHA-256) with the sender's private key, to provide integrity and authentication

    ```bash
    ~$ openssl pkeyutl -sign \
         -rawin \
         -digest sha256 \
         -in message.txt \
         -inkey alice_private.pem \
         -out message_signature.bin
    ```

3.  Concatenate the message with the signature, obtaining a "signed message"

    ```bash
    ~$ cat message.txt message_signature.bin \
         > signed_message.bin
    ```

4.  Encrypt the signed message with the symmetric key, to provide confidentiality

    ```bash
    ~$ openssl aes-256-cbc -e \
         -in signed_message.bin \
         -K '6B4228406C477446E5EF2A4C1264CEDB32E880943394339D94BB09E8B14A4D37' \
         -iv '954BA07180073753826E151DF39FBADD' \
         -nosalt \
         -out encrypted_message.bin
    ```

5.  Encrypt the symmetric key with the public key of the recipient, ensuring its confidentiality

    ```bash
    ~$ openssl pkeyutl -encrypt \
         -pubin \
         -inkey bob_public.pem \
         -in aeskey.dat \
         -out aeskey_encrypted.bin
    ~$ openssl pkeyutl -encrypt \
         -pubin \
         -inkey bob_public.pem \
         -in aeskiv.dat \
         -out aesiv_encrypted.bin
    ```

6.  Concatenate the encrypted message with the encrypted symmetric key, obtaining an encrypted packet ready to be sent over an insecure channel

    ```bash
    ~$ cat encrypted_message.bin aeskey_encrypted.bin aesiv_encrypted.bin \
         > encrypted_package.bin
    ```

### Receiving the message

1.  Divide the encrypted packet in its three parts: `encrypted_message.bin`, `aeskey_encrypted.bin` and `aesiv_encrypted.bin`.

2.  Decrypt the symmetric key with the recipient's private key

    ```bash
    ~$ openssl pkeyutl -decrypt \
         -inkey bob_private.pem \
         -in aeskey_encrypted.bin \
         -out aeskey_decrypted.dat
    ~$ openssl pkeyutl -decrypt \
         -inkey bob_private.pem \
         -in aesiv_encrypted.bin \
         -out aesiv_decrypted.dat
    ```
 
3.  Decrypt the message with the symmetric key

    ```bash
    ~$ openssl aes-256-cbc -d \
         -in encrypted_message.bin \
         -K '6B4228406C477446E5EF2A4C1264CEDB32E880943394339D94BB09E8B14A4D37' \
         -iv '954BA07180073753826E151DF39FBADD' \
         -nosalt \
         -out decrypted_message.bin
    ```

4.  Divide the decrypted message in cleartext (`decrypted_message.txt`) and signature (`decrypted_message_signature.bin`).

5. Verify the decrypted message with the sender's public key

    ```bash
    ~$ openssl pkeyutl -verify \
         -rawin \
         -digest sha256 \
         -in decrypted_message.txt \
         -sigfile decrypted_message_signature.bin \
         -pubin \
         -inkey alice_public.pem
    Signature Verified Successfully
    ```

