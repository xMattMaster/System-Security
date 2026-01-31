"use server"

import "server-only"
import {auth} from "@/lib/auth";

export async function isAdmin(): Promise<boolean> {
    const session = await auth();
    
    if (!session?.user?.groups) {
        return false;
    }

    return session.user.groups.some(group => group.endsWith("/Amministratore") || group === "Amministratore");
}

export async function requireAdmin() {
    const admin = await isAdmin();
    
    if (!admin) {
        throw new Error("Accesso negato: privilegi di amministratore richiesti");
    }
}
