"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";
import {LayoutDashboard, CreditCard, Car, User, Map, Shield} from "lucide-react";
import {useUserGroups} from "@/components/dashboard/dashboard-content";
import * as React from "react";

const sidebarItems = [
    {
        title: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Veicoli",
        href: "/dashboard/vehicles",
        icon: Car,
    },
    {
        title: "Pagamenti",
        href: "/dashboard/payments",
        icon: CreditCard,
    },
    {
        title: "Viaggi",
        href: "/dashboard/trips",
        icon: Map,
    },
    {
        title: "Account",
        href: "/dashboard/account",
        icon: User,
    },
];

const adminItems = [
    {
        title: "Amministrazione",
        href: "/dashboard/admin",
        icon: Shield,
    },
];

interface SidebarProps {
    isMobileMenuOpen?: boolean;
    setIsMobileMenuOpen?: (open: boolean) => void;
}

export function Sidebar({isMobileMenuOpen = false, setIsMobileMenuOpen}: SidebarProps = {}) {
    const pathname = usePathname();
    const groups = useUserGroups();
    const isAdmin = groups.some(group => group.endsWith("/Amministratore") || group === "Amministratore");

    const itemsToShow = isAdmin ? [...sidebarItems, ...adminItems] : sidebarItems;

    const SidebarContent = () => (
        <>
            <h2 className="font-semibold text-lg mb-6 px-4">Menu</h2>
            <nav className="space-y-2">
                {itemsToShow.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen?.(false)}
                        className={cn(
                            "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                            pathname === item.href
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                        )}
                    >
                        <item.icon className="h-5 w-5"/>
                        <span>{item.title}</span>
                    </Link>
                ))}
            </nav>
        </>
    );

    return (
        <>
            {/* Mobile sidebar overlay */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileMenuOpen?.(false)}
                />
            )}

            {/* Mobile sidebar */}
            <div
                className={cn(
                    "md:hidden fixed left-0 top-0 h-full w-64 bg-background border-r z-40 transition-transform duration-300 ease-in-out",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-6 pt-20">
                    <SidebarContent/>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="w-64 border-r bg-muted/10 hidden md:block h-[calc(100vh-4rem)] sticky top-16">
                <div className="p-6">
                    <SidebarContent/>
                </div>
            </div>
        </>
    );
}
