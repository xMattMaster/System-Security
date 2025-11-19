# Homework 1 -Exercise 1: Symmetric encryption

In this exercise, we simulate a simple secure communication scenario using a pre-shared symmetric key. We use *AES-256-CBC* as the encryption algorithm.

1.  Generate a symmetric key of length 256 to use with AES for secure communication (assuming the key is pre-shared by the parties).

    ```bash
    ~$ openssl enc -aes-256-cbc \
         -k arneseconte -P \
         -md sha256 \
         -nosalt
    ```

2.  Encrypt the message

    ```bash
    ~$ openssl aes-256-cbc -e \
         -in message.txt \
         -K '6B4228406C477446E5EF2A4C1264CEDB32E880943394339D94BB09E8B14A4D37' \
         -iv '954BA07180073753826E151DF39FBADD' \
         -nosalt \
         -out encrypted_message.bin
    ```

3.  Decrypt the message

    ```bash
    ~$ openssl aes-256-cbc -d \
         -in encrypted_message.bin \
         -K '6B4228406C477446E5EF2A4C1264CEDB32E880943394339D94BB09E8B14A4D37' \
         -iv '954BA07180073753826E151DF39FBADD' -nosalt \
         -out decrypted_message.txt
    ```
