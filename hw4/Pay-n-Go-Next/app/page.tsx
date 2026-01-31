"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ShieldCheck, Zap, Leaf } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                                Viaggia Smart, <br /> Paga Green.
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground mb-8">
                                La piattaforma di telepedaggio moderna per gestire i tuoi viaggi in modo semplice, veloce ed ecosostenibile.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" asChild>
                                    <Link href="/dashboard">
                                        Inizia Ora <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href="/terms">Scopri di più</Link>
                                </Button>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video">
                                {/* Placeholder image representing modern, green, smart toll payment */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/homepage/hpHighway.webp"
                                    alt="Smart Highway"
                                    className="object-cover w-full h-full"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay" />
                            </div>
                        </motion.div>
                    </div>
                </div>
                {/* Background decoration */}
                <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-bl from-primary/5 to-transparent blur-3xl" />
            </section>

            {/* Features Section */}
            <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Perché scegliere Pay n&apos; Go Next?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Semplifichiamo la tua esperienza di viaggio con tecnologia all&apos;avanguardia.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="h-10 w-10 text-primary" />}
                            title="Veloce & Immediato"
                            description="Passa i caselli senza fermarti. I pagamenti sono automatici e istantanei."
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="h-10 w-10 text-primary" />}
                            title="Sicuro & Affidabile"
                            description="I tuoi dati sono protetti con i più alti standard di sicurezza bancaria."
                        />
                        <FeatureCard
                            icon={<Leaf className="h-10 w-10 text-primary" />}
                            title="Green & Sostenibile"
                            description="Riduci le emissioni evitando code e stop-and-go ai caselli."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <Card className="border-none shadow-lg bg-background/60 backdrop-blur hover:shadow-xl transition-shadow">
            <CardHeader>
                <div className="mb-4 p-3 bg-primary/10 w-fit rounded-xl">{icon}</div>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
