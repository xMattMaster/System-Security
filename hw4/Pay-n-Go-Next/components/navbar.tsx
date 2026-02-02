"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Car, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function Navbar() {
    const { data: session } = useSession();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <Car className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl">Pay n&apos; Go Next</span>
                </Link>

                <div className="hidden md:flex items-center space-x-6">
                    <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                        Home
                    </Link>
                    {session ? (
                        <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                            Dashboard
                        </Link> ): null }
                    <Link href="/contacts" className="text-sm font-medium hover:text-primary transition-colors">
                        About us
                    </Link>
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {session ? (
                        <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {session.user?.name || session.user?.email}
              </span>
                            <Button onClick={() => signOut()} variant="destructive" size="sm">
                                Sign Out
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={() => signIn("keycloak")} size="sm">
                            Sign In
                        </Button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="mr-2"
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t p-4 space-y-4 bg-background">
                    <Link href="/" className="block text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                        Home
                    </Link>
                    <Link href="/dashboard" className="block text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                        Dashboard
                    </Link>
                    <Link href="/contacts" className="block text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                        About us
                    </Link>
                    <div className="pt-4 border-t">
                        {session ? (
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">{session.user?.name}</p>
                                <Button onClick={() => signOut()} variant="destructive" className="w-full">
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={() => signIn("keycloak")} className="w-full">
                                Sign In
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
