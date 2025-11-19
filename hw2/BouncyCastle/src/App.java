import java.io.FileOutputStream;
import java.io.FileWriter;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.Signature;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.Arrays;
import java.util.Date;

import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x509.BasicConstraints;
import org.bouncycastle.asn1.x509.Extension;
import org.bouncycastle.asn1.x509.KeyUsage;
import org.bouncycastle.asn1.x509.SubjectPublicKeyInfo;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.X509v3CertificateBuilder;
import org.bouncycastle.cert.jcajce.JcaCertStore;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.cms.CMSProcessableByteArray;
import org.bouncycastle.cms.CMSSignedData;
import org.bouncycastle.cms.CMSSignedDataGenerator;
import org.bouncycastle.cms.SignerInformation;
import org.bouncycastle.cms.SignerInformationVerifier;
import org.bouncycastle.cms.jcajce.JcaSignerInfoGeneratorBuilder;
import org.bouncycastle.cms.jcajce.JcaSimpleSignerInfoVerifierBuilder;
import org.bouncycastle.openssl.jcajce.JcaPEMWriter;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.DigestCalculatorProvider;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.operator.jcajce.JcaDigestCalculatorProviderBuilder;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;
import org.bouncycastle.pkcs.PKCS10CertificationRequestBuilder;
import org.bouncycastle.pkcs.jcajce.JcaPKCS10CertificationRequestBuilder;

public class App {

    private void certificateExample() {
        try {
            System.out.println("Certificate example:");

            // Generate two asymmetric key pair using RSA-4096
            KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance("RSA");
            keyPairGen.initialize(4096);

            // CA's key pair
            KeyPair caKeyPair = keyPairGen.generateKeyPair();
            PrivateKey caPrivateKey = caKeyPair.getPrivate();
            PublicKey capPublicKey = caKeyPair.getPublic();
            SubjectPublicKeyInfo capPublicKeyInfo = SubjectPublicKeyInfo.getInstance(capPublicKey.getEncoded());

            // Alice's key pair
            KeyPair aliceKeyPair = keyPairGen.generateKeyPair();
            PrivateKey alicePrivateKey = aliceKeyPair.getPrivate();
            PublicKey alicepPublicKey = aliceKeyPair.getPublic();
            SubjectPublicKeyInfo alicePublicKeyInfo = SubjectPublicKeyInfo.getInstance(alicepPublicKey.getEncoded());

            // Create a new self-signed X.509 certificate for the CA
            X500Name issuer = new X500Name(
                    "CN=Certification Authority S.p.A.,O=Certification Authority S.p.A.,L=Naples,C=IT");
            X500Name subject = issuer;
            Date notBefore = new Date();
            Date notAfter = new Date(notBefore.getTime() + 365L * 24 * 60 * 60 * 1000);
            BigInteger serial = new BigInteger(160, new SecureRandom());

            ContentSigner caSigner = new JcaContentSignerBuilder("SHA256withRSA").build(caPrivateKey);
            X509v3CertificateBuilder caCertBuilder = new X509v3CertificateBuilder(issuer, serial, notBefore, notAfter,
                    subject, capPublicKeyInfo);
            BasicConstraints caBasicConstraints = new BasicConstraints(true);
            caCertBuilder.addExtension(Extension.basicConstraints, true, caBasicConstraints);
            KeyUsage caKeyUsage = new KeyUsage(KeyUsage.keyCertSign | KeyUsage.cRLSign);
            caCertBuilder.addExtension(Extension.keyUsage, true, caKeyUsage);
            X509CertificateHolder caHolder = caCertBuilder.build(caSigner);
            X509Certificate caCertificate = new JcaX509CertificateConverter().getCertificate(caHolder);

            // Write the CA certificate to a PEM file
            JcaPEMWriter caCertWriter = new JcaPEMWriter(new FileWriter("ca_certificate.crt"));
            caCertWriter.writeObject(caCertificate);
            caCertWriter.close();
            System.out.println("CA Certificate generated and saved to ca_certificate.crt");

            // Create a new X.509 certificate request for Alice
            subject = new X500Name("CN=Alice, O=Universita' degli Studi di Napoli \"Federico II\", L=Naples, C=IT");

            ContentSigner aliceSigner = new JcaContentSignerBuilder("SHA256withRSA").build(alicePrivateKey);
            PKCS10CertificationRequestBuilder aliceCsrBuilder = new JcaPKCS10CertificationRequestBuilder(subject,
                    alicepPublicKey);
            PKCS10CertificationRequest aliceCsr = aliceCsrBuilder.build(aliceSigner);

            // Write the CSR to a PEM file
            JcaPEMWriter aliceCsrWriter = new JcaPEMWriter(new FileWriter("alice_request.csr"));
            aliceCsrWriter.writeObject(aliceCsr);
            aliceCsrWriter.close();
            System.out.println("Alice's CSR generated and saved to alice_request.csr");

            // Create a new X.509 certificate for Alice signed by the CA
            subject = aliceCsr.getSubject();
            notBefore = new Date();
            notAfter = new Date(notBefore.getTime() + 365L * 24 * 60 * 60 * 1000);
            serial = new BigInteger(160, new SecureRandom());
            alicePublicKeyInfo = aliceCsr.getSubjectPublicKeyInfo();

            X509v3CertificateBuilder aliceCertBuilder = new X509v3CertificateBuilder(issuer, serial, notBefore,
                    notAfter, subject, alicePublicKeyInfo);
            BasicConstraints aliceBasicConstraints = new BasicConstraints(false);
            aliceCertBuilder.addExtension(Extension.basicConstraints, true, aliceBasicConstraints);
            KeyUsage aliceKeyUsage = new KeyUsage(
                    KeyUsage.digitalSignature | KeyUsage.nonRepudiation | KeyUsage.keyEncipherment);
            aliceCertBuilder.addExtension(Extension.keyUsage, true, aliceKeyUsage);
            X509CertificateHolder aliceHolder = aliceCertBuilder.build(caSigner);
            X509Certificate aliceCertificate = new JcaX509CertificateConverter().getCertificate(aliceHolder);

            // Write the CA certificate to a PEM file
            JcaPEMWriter aliceCertWriter = new JcaPEMWriter(new FileWriter("alice_certificate.crt"));
            aliceCertWriter.writeObject(aliceCertificate);
            aliceCertWriter.close();
            System.out.println("Alice's certificate generated and saved to alice_certificate.crt");

            // Create a P12 file containing CA's private key and certificate
            KeyStore caPKCS12KeyStore = KeyStore.getInstance("PKCS12");
            caPKCS12KeyStore.load(null, null);
            caPKCS12KeyStore.setKeyEntry("ca", caPrivateKey, "arneseconte".toCharArray(),
                    new X509Certificate[] { caCertificate });

            // Save the P12 file
            FileOutputStream caP12File = new FileOutputStream("ca_certificate.p12");
            caPKCS12KeyStore.store(caP12File, "arneseconte".toCharArray());
            caP12File.close();
            System.out.println("CA's PKCS#12 keystore generated and saved to ca_certificate.p12");

            // Create a P12 file containing Alice's private key and certificate chain
            KeyStore alicePKCS12 = KeyStore.getInstance("PKCS12");
            alicePKCS12.load(null, null);
            X509Certificate[] aliceChain = new X509Certificate[] { aliceCertificate, caCertificate };
            alicePKCS12.setKeyEntry("alice", alicePrivateKey, "arneseconte".toCharArray(), aliceChain);

            // Save the P12 file
            FileOutputStream aliceP12File = new FileOutputStream("alice_certificate.p12");
            alicePKCS12.store(aliceP12File, "arneseconte".toCharArray());
            aliceP12File.close();
            System.out.println("Alice's PKCS#12 keystore generated and saved to alice_certificate.p12");

            // Sign a PDF using Alice's private key from the P12 file
            PrivateKey aliceKey = (PrivateKey) alicePKCS12.getKey("alice", "arneseconte".toCharArray());
            byte[] data = Files.readAllBytes(Paths.get("hamlet.pdf"));
            Signature pdfSigner = Signature.getInstance("SHA256withRSA");
            pdfSigner.initSign(aliceKey);
            pdfSigner.update(data);
            byte[] signature = pdfSigner.sign();
            Files.write(Paths.get("hamlet.pdf.sig"), signature);
            System.out.println("PDF signed and signature saved to hamlet.pdf.sig");

            // Verify the PDF signature using Alice's certificate
            byte[] sigFile = Files.readAllBytes(Paths.get("hamlet.pdf.sig"));
            X509Certificate aliceCert = (X509Certificate) alicePKCS12.getCertificate("alice");
            pdfSigner.initVerify(aliceCert);
            pdfSigner.update(data);
            boolean isVerified = pdfSigner.verify(sigFile);
            System.out.println("PDF signature verification: " + isVerified);

            // Sign the PDF using CMS
            DigestCalculatorProvider digestProvider = new JcaDigestCalculatorProviderBuilder().build();
            CMSSignedDataGenerator cmsGenerator = new CMSSignedDataGenerator();
            cmsGenerator.addSignerInfoGenerator(
                    new JcaSignerInfoGeneratorBuilder(digestProvider).build(aliceSigner, aliceCert));
            cmsGenerator.addCertificates(new JcaCertStore(Arrays.asList(aliceCert, caCertificate)));
            CMSProcessableByteArray cmsData = new CMSProcessableByteArray(data);
            CMSSignedData cmsSignedData = cmsGenerator.generate(cmsData, true);
            Files.write(Paths.get("hamlet.pdf.p7s"), cmsSignedData.getEncoded());
            System.out.println("PDF signed using CMS and saved to hamlet.pdf.p7s");

            // Verify the CMS signature
            CMSSignedData cmsReceivedData = new CMSSignedData(Files.readAllBytes(Paths.get("hamlet.pdf.p7s")));
            SignerInformation cmsSigner = cmsReceivedData.getSignerInfos().getSigners().iterator().next();
            X509CertificateHolder cmsCertHolder = (X509CertificateHolder) cmsReceivedData.getCertificates()
                    .getMatches(cmsSigner.getSID()).iterator().next();
            SignerInformationVerifier cmsVerifier = new JcaSimpleSignerInfoVerifierBuilder().build(cmsCertHolder);
            boolean cmsVerified = cmsSigner.verify(cmsVerifier);
            System.out.println("CMS signature verification: " + cmsVerified);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void extractCertInfo() {
        try {
            System.out.println("Extract Certificate Info example:");
            // Load Alice's certificate
            CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
            X509Certificate aliceCertificate = (X509Certificate) certificateFactory
                    .generateCertificate(Files.newInputStream(Paths.get("alice_certificate.crt")));

            // Extract and print certificate information
            System.out.println("Subject: " + aliceCertificate.getSubjectDN());
            System.out.println("Issuer: " + aliceCertificate.getIssuerDN());
            System.out.println("Serial Number: " + aliceCertificate.getSerialNumber());
            System.out.println("Valid From: " + aliceCertificate.getNotBefore());
            System.out.println("Valid To: " + aliceCertificate.getNotAfter());
            System.out.println("Public Key: " + aliceCertificate.getPublicKey());
            System.out.println("Signature Algorithm: " + aliceCertificate.getSigAlgName());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) throws Exception {
        App app = new App();
        app.certificateExample();
        System.out.print("\n\n");
        app.extractCertInfo();
    }
}
