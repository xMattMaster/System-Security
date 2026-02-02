"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, University, GraduationCap, Code2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ContactsPage() {
  const team = [
    {
      name: "Matteo Arnese",
      role: "Studente",
      github: "https://github.com/xMattMaster",
      avatar: "https://avatars.githubusercontent.com/u/68701124?v=4",
      initials: "MA",
    },
    {
      name: "Pietro Conte",
      role: "Studente",
      github: "https://github.com/pietroconte3",
      avatar: "https://avatars.githubusercontent.com/u/167124462?v=4",
      initials: "PC",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Intro Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="container mx-auto relative z-10 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent pb-3">
              Chi Siamo
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance">
              Questo progetto è stato realizzato come parte del corso di{" "}
              <span className="font-semibold text-primary">System Security</span>{" "}
              per l&apos;anno accademico <span className="font-mono">2025/2026</span>.
            </p>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <University className="w-5 h-5" />
              <span className="font-medium">Università degli Studi di Napoli &quot;Federico II&quot;</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card className="h-full border-none shadow-lg overflow-hidden bg-card/50 backdrop-blur-sm hover:bg-card transition-colors">
                  <CardContent className="flex flex-col items-center pt-10 pb-8 text-center">
                    <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden border-4 border-primary/10 shadow-xl group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-2">{member.name}</h2>
                    
                    <div className="flex items-center gap-2 text-muted-foreground mb-6">
                      <GraduationCap className="w-4 h-4" />
                      <span>{member.role}</span>
                    </div>

                    <Button variant="outline" className="gap-2" asChild>
                      <Link href={member.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                        GitHub Profile
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Info Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-background to-primary/5">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl flex items-center justify-center gap-3">
                  <Code2 className="w-6 h-6 text-primary" />
                  Il Progetto
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-4">
                <p className="text-muted-foreground mb-8">
                  Lo sviluppo di questa applicazione web ci ha permesso di approfondire tematiche legate alla sicurezza informatica,
                  all&apos;autenticazione sicura e alla gestione di infrastrutture crittografiche moderne.
                </p>
                <Button size="lg" className="bg-gradient-to-r from-primary to-emerald-600 hover:opacity-90 border-0" asChild>
                  <Link href="https://github.com/xMattMaster/System-Security" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 w-5 h-5" />
                    Vedi su GitHub
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
