import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Cookie Policy</CardTitle>
          <p className="text-muted-foreground">Effective Date: 01/02/2026</p>
        </CardHeader>
        <CardContent className="max-w-none">
          <h2>1. Introduction</h2>
          <p>
            At Pay n&apos; Go Next, we respect your privacy and represent transparency in how we handle your data. 
            This Cookie Policy explains how we use cookies and similar technologies on our website.
          </p>
          <p>
            We strictly limit our use of storage technologies to those that are absolutely necessary for the website to function securely and correctly. 
            We do not use any third-party tracking, advertising, or analytics cookies. All data stored is first-party and essential for providing our service to you.
          </p>

          <h2>2. Strictly Necessary Technologies</h2>
          <p>
            The following table lists the specific cookies and local storage items we use. These are essential for authentication, security, and your user interface preferences. 
            You cannot opt-out of these as they are required for the system to work.
          </p>

          <div className="my-6 w-full overflow-y-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Purpose</th>
                  <th className="p-4 font-medium">Origin</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 font-mono text-xs text-primary">__Host-next-auth.csrf-token</td>
                  <td className="p-4">Cookie</td>
                  <td className="p-4">Ensures security by preventing Cross-Site Request Forgery (CSRF) attacks.</td>
                  <td className="p-4">First-party<br/><span className="text-xs text-muted-foreground">https://arneseconte.it/</span></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-xs text-primary">__Secure-next-auth.callback-url</td>
                  <td className="p-4">Cookie</td>
                  <td className="p-4">Remembers the URL to redirect to after successful authentication.</td>
                  <td className="p-4">First-party<br/><span className="text-xs text-muted-foreground">https://arneseconte.it/</span></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-xs text-primary">__Secure-next-auth.session-token</td>
                  <td className="p-4">Cookie</td>
                  <td className="p-4">Maintains your active session securely after logging in.</td>
                  <td className="p-4">First-party<br/><span className="text-xs text-muted-foreground">https://arneseconte.it/</span></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-xs text-primary">AUTH_SESSION_ID</td>
                  <td className="p-4">Cookie</td>
                  <td className="p-4">Manages the authentication session state with our identity provider.</td>
                  <td className="p-4">First-party<br/><span className="text-xs text-muted-foreground">https://arneseconte.it/</span></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-xs text-primary">KC_AUTH_SESSION_HASH</td>
                  <td className="p-4">Cookie</td>
                  <td className="p-4">Validates the integrity of the authentication session.</td>
                  <td className="p-4">First-party<br/><span className="text-xs text-muted-foreground">https://arneseconte.it/</span></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-xs text-primary">KC_RESTART</td>
                  <td className="p-4">Cookie</td>
                  <td className="p-4">Manages session restart capabilities during login flows.</td>
                  <td className="p-4">First-party<br/><span className="text-xs text-muted-foreground">https://arneseconte.it/</span></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-xs text-primary">nextauth.message</td>
                  <td className="p-4">Local Storage</td>
                  <td className="p-4">Stores short-term state messages (e.g., errors) during authentication.</td>
                  <td className="p-4">First-party<br/><span className="text-xs text-muted-foreground">https://arneseconte.it/</span></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-xs text-primary">theme</td>
                  <td className="p-4">Local Storage</td>
                  <td className="p-4">Remembers your preferred visual theme (light or dark mode).</td>
                  <td className="p-4">First-party<br/><span className="text-xs text-muted-foreground">https://arneseconte.it/</span></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-xs text-primary">cookie-acknowledgement</td>
                  <td className="p-4">Local Storage</td>
                  <td className="p-4">Remembers if you have acknowledged the cookie banner.</td>
                  <td className="p-4">First-party<br/><span className="text-xs text-muted-foreground">https://arneseconte.it/</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>3. Managing Cookies</h2>
          <p>
            Since we only use strictly necessary cookies required for the website to function, we do not provide an option to disable them through a cookie banner. 
            You can manage or block cookies through your browser settings, but please note that doing so will likely cause the Service to stop working correctly (e.g., you will not be able to log in).
          </p>

          <h2>4. Contact Us</h2>
          <p>If you have questions about this Cookie Policy, please contact us at:</p>
          <p><strong>Pay n&apos; Go Next</strong></p>
          <p><a href="https://arneseconte.it" className="text-primary hover:underline">https://arneseconte.it</a></p>
          <p>Email: <a href="mailto:arneseconte@proton.me" className="text-primary hover:underline">arneseconte@proton.me</a></p>
          
        </CardContent>
      </Card>
    </div>
  );
}
