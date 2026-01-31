"use server"

import "server-only"

export async function getKeycloakAccountUrl(): Promise<string> {
    const issuer = process.env.NEXTAUTH_URL || "";
    if (!issuer) return "";
    return issuer.replace(/\/+$/, "") + "/auth/keycloak/realms/Pay-n-Go-Next/account";
}
