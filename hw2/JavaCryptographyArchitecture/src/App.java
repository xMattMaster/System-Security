import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.KeyPair;
import java.security.SecureRandom;
import java.security.Signature;

import java.nio.ByteBuffer;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public class App {

    public String bytesToHex(byte[] bytes) {
        char[] hexDigits = new char[bytes.length * 2];
        for (int i = 0; i < bytes.length; i++) {
            hexDigits[2 * i] = Character.forDigit((bytes[i] >> 4) & 0xF, 16);
            hexDigits[(2 * i) + 1] = Character.forDigit((bytes[i] & 0xF), 16);
        }
        return new String(hexDigits);
    }

    private void symmetricEncryptionExample() {
        try {
            System.out.println("Symmetric Encryption example using AES-256:");
            String message = "Hello world!";
            System.out.println("Original Message: " + message);

            // Generate a symmetric key using AES-256
            KeyGenerator keyGen = KeyGenerator.getInstance("AES");
            keyGen.init(256);
            SecretKey symmetricKey = keyGen.generateKey();
            System.out.println("Generated Symmetric Key (AES-256): " + bytesToHex(symmetricKey.getEncoded()));

            // Initialize a Cipher for encryption
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");

            // Generate a random IV
            byte[] iv = new byte[cipher.getBlockSize()];
            new SecureRandom().nextBytes(iv);
            System.out.println("Generated IV: " + bytesToHex(iv));

            // Encrypt the message
            cipher.init(Cipher.ENCRYPT_MODE, symmetricKey, new IvParameterSpec(iv));
            byte[] encryptedMessage = cipher.doFinal(message.getBytes());
            System.out.println("Encrypted Message (AES-256): " + bytesToHex(encryptedMessage));

            // Decrypt the message
            cipher.init(Cipher.DECRYPT_MODE, symmetricKey, new IvParameterSpec(iv));
            byte[] decryptedMessage = cipher.doFinal(encryptedMessage);
            System.out.println("Decrypted Message: " + new String(decryptedMessage));

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void asymmetricEncryptionExample() {
        try {
            System.out.println("Asymmetric Encryption example using RSA-4096:");
            String message = "Hello world!";
            System.out.println("Original Message: " + message);

            // Generate an asymmetric key pair using RSA-4096
            KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance("RSA");
            keyPairGen.initialize(4096);
            KeyPair keyPair = keyPairGen.generateKeyPair();
            PrivateKey privateKey = keyPair.getPrivate();
            PublicKey publicKey = keyPair.getPublic();

            // Initialize a Cipher for encryption
            Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding");
            
            // Encrypt the message
            cipher.init(Cipher.ENCRYPT_MODE, publicKey);
            byte[] encryptedMessage = cipher.doFinal(message.getBytes());
            System.out.println("Encrypted Message (RSA-4096): " + bytesToHex(encryptedMessage));

            // Decrypt the message
            cipher.init(Cipher.DECRYPT_MODE, privateKey);
            byte[] decryptedMessage = cipher.doFinal(encryptedMessage);
            System.out.println("Decrypted Message: " + new String(decryptedMessage));

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void encryptedPackageExample() {
        try {
            System.out.println("Encrypted Package example:");
            String message = "Hello world!";
            System.out.println("Original Message: " + message);

            // Generate a symmetric key using AES-256
            KeyGenerator keyGen = KeyGenerator.getInstance("AES");
            keyGen.init(256);
            SecretKey symmetricKey = keyGen.generateKey();

            // Generate two asymmetric key pairs using RSA-4096
            KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance("RSA");
            keyPairGen.initialize(4096);

            // Alice's key pair
            KeyPair aliceKeyPair = keyPairGen.generateKeyPair();
            PrivateKey alicePrivateKey = aliceKeyPair.getPrivate();
            PublicKey alicepPublicKey = aliceKeyPair.getPublic();

            // Bob's key pair
            KeyPair bobKeyPair = keyPairGen.generateKeyPair();
            PrivateKey bobPrivateKey = bobKeyPair.getPrivate();
            PublicKey bobPublicKey = bobKeyPair.getPublic();

            // Sign the message with Alice's private key
            Signature aliceSignature = Signature.getInstance("SHA256withRSA");
            aliceSignature.initSign(alicePrivateKey);
            aliceSignature.update(message.getBytes());
            byte[] messageSignature = aliceSignature.sign();

            // Concatenate message and signature
            byte[] messageBytes = message.getBytes();
            ByteBuffer signedMessageBuffer = ByteBuffer.allocate(8 + messageBytes.length + messageSignature.length);
            signedMessageBuffer.putInt(messageBytes.length);
            signedMessageBuffer.putInt(messageSignature.length);
            signedMessageBuffer.put(messageBytes);
            signedMessageBuffer.put(messageSignature);
            byte[] signedMessage = signedMessageBuffer.array();

            // Encrypt the signed message with the symmetric key
            Cipher encryptedSignedMessageCipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            byte[] iv = new byte[encryptedSignedMessageCipher.getBlockSize()];
            new SecureRandom().nextBytes(iv);
            encryptedSignedMessageCipher.init(Cipher.ENCRYPT_MODE, symmetricKey, new IvParameterSpec(iv));
            byte[] encryptedSignedMessage = encryptedSignedMessageCipher.doFinal(signedMessage);

            // Encrypt the symmetric key with Bob's public key
            Cipher encryptedSymmetricKeyCipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding");
            encryptedSymmetricKeyCipher.init(Cipher.ENCRYPT_MODE, bobPublicKey);
            byte[] encryptedSymmetricKey = encryptedSymmetricKeyCipher.doFinal(symmetricKey.getEncoded());
            byte[] encryptedIV = encryptedSymmetricKeyCipher.doFinal(iv);

            // Create the encrypted package
            ByteBuffer packageBuffer = ByteBuffer.allocate(12 + encryptedSignedMessage.length + encryptedSymmetricKey.length + encryptedIV.length);
            packageBuffer.putInt(encryptedSignedMessage.length);
            packageBuffer.putInt(encryptedSymmetricKey.length);
            packageBuffer.putInt(encryptedIV.length);
            packageBuffer.put(encryptedSignedMessage);
            packageBuffer.put(encryptedSymmetricKey);
            packageBuffer.put(encryptedIV);
            byte[] encryptedPackage = packageBuffer.array();

            System.out.println("Encrypted Package (hex): " + bytesToHex(encryptedPackage));

            // Once transmitted, split the package back into its components
            ByteBuffer receivedPackageBuffer = ByteBuffer.wrap(encryptedPackage);
            int receivedEncryptedMessageLength = receivedPackageBuffer.getInt();
            int receivedEncryptedSymmetricKeyLength = receivedPackageBuffer.getInt();
            int receivedEncryptedIVLength = receivedPackageBuffer.getInt();
            byte[] receivedEncryptedMessage = new byte[receivedEncryptedMessageLength];
            byte[] receivedEncryptedSymmetricKey = new byte[receivedEncryptedSymmetricKeyLength];
            byte[] receivedEncryptedIV = new byte[receivedEncryptedIVLength];
            receivedPackageBuffer.get(receivedEncryptedMessage);
            receivedPackageBuffer.get(receivedEncryptedSymmetricKey);
            receivedPackageBuffer.get(receivedEncryptedIV);

            // Decrypt the symmetric key with Bob's private key
            Cipher decryptedSymmetricKeyCipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding");
            decryptedSymmetricKeyCipher.init(Cipher.DECRYPT_MODE, bobPrivateKey);
            SecretKey decryptedSymmetricKey =  new SecretKeySpec(decryptedSymmetricKeyCipher.doFinal(receivedEncryptedSymmetricKey), "AES");
            byte[] decryptedIV = decryptedSymmetricKeyCipher.doFinal(receivedEncryptedIV);

            // Decrypt the signed message with the decrypted symmetric key
            Cipher decryptedSignedMessageCipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            decryptedSignedMessageCipher.init(Cipher.DECRYPT_MODE, decryptedSymmetricKey, new IvParameterSpec(decryptedIV));
            byte[] decryptedSignedMessage = decryptedSignedMessageCipher.doFinal(receivedEncryptedMessage);

            // Separate the message and signature
            ByteBuffer decryptedSignedMessageBuffer = ByteBuffer.wrap(decryptedSignedMessage);
            int decryptedMessageLength = decryptedSignedMessageBuffer.getInt();
            int decryptedMessageSignatureLength = decryptedSignedMessageBuffer.getInt();
            byte[] decryptedMessageBytes = new byte[decryptedMessageLength];
            byte[] decryptedSignature = new byte[decryptedMessageSignatureLength];
            decryptedSignedMessageBuffer.get(decryptedMessageBytes);
            decryptedSignedMessageBuffer.get(decryptedSignature);
            String receivedMessage = new String(decryptedMessageBytes);
            System.out.println("Decrypted Message: " + receivedMessage);

            // Verify the signature with Alice's public key
            Signature aliceSignatureVerify = Signature.getInstance("SHA256withRSA");
            aliceSignatureVerify.initVerify(alicepPublicKey);
            aliceSignatureVerify.update(decryptedMessageBytes);
            boolean isVerified = aliceSignatureVerify.verify(decryptedSignature);
            System.out.println("Signature Verified: " + isVerified);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        App app = new App();
        app.symmetricEncryptionExample();
        System.out.println("\n\n");
        app.asymmetricEncryptionExample();
        System.out.println("\n\n");
        app.encryptedPackageExample();
    }
}
