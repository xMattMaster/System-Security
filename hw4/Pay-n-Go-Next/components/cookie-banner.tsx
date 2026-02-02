"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const acknowledged = localStorage.getItem("cookie-acknowledgement");
      if (!acknowledged) {
        setShowBanner(true);
      }
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-acknowledgement", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-[28rem] animate-in slide-in-from-bottom duration-500 slide-in-from-bottom-4 fade-in">
      <Card className="shadow-2xl border-primary/20 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="p-6">
            <h3 className="font-semibold text-lg mb-2">Informativa sui Cookie</h3>
            <p className="text-sm text-muted-foreground mb-4">
                Utilizziamo solo cookie tecnici strettamente necessari per garantire il funzionamento del sito. 
                Utilizzando il sito, accetti l&apos;uso di queste tecnologie essenziali.
                <br />
                Vedi la nostra{" "}
                <Link href="/cookie-policy" className="text-primary hover:underline underline-offset-4">
                    Cookie Policy
                </Link>.
            </p>
            <div className="flex justify-end">
                <Button onClick={acceptCookies} size="sm">
                    Ho capito
                </Button>
            </div>
        </div>
      </Card>
    </div>
  );
}
