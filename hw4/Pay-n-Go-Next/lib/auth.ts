import "server-only"
import type {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
} from "next"
import fs from "fs"
import type {NextAuthOptions} from "next-auth"
import {getServerSession} from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";
import * as https from "node:https";
import {custom} from "openid-client";

const keycloakAgent = new https.Agent({
    cert: fs.readFileSync(process.env.KEYCLOAK_SSL_CLIENTCERT || ""),
    key: fs.readFileSync(process.env.KEYCLOAK_SSL_CLIENTKEY || ""),
    ca: fs.readFileSync(process.env.KEYCLOAK_SSL_ROOTCERT || ""),
    rejectUnauthorized: process.env.NODE_ENV === 'production',
});

custom.setHttpOptionsDefaults({
    agent: keycloakAgent
});

const baseUrl = (process.env.NEXTAUTH_URL || "").replace(/\/+$/, "")

export const config = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_ID || "",
            clientSecret: process.env.KEYCLOAK_SECRET || "",
            issuer: process.env.KEYCLOAK_ISSUER,
            authorization: {
                params: {
                    redirect_uri: `${baseUrl}/api/auth/callback/keycloak`
                }
            },
        }),
    ],
    callbacks: {
        async jwt({token, profile, account}) {
            if (profile) {
                token.sub = profile.sub
                token.firstName = profile.given_name
                token.lastName = profile.family_name
                token.groups = profile.groups || []
                token.provider = account?.provider
            }
            return token
        },
        async session({session, token}) {
            if (session.user) {
                session.user.id = token.sub
                session.user.firstName = token.firstName as string | undefined
                session.user.lastName = token.lastName as string | undefined
                session.user.groups = token.groups as string[] || []
            }
            return session
        }
    },
    debug: process.env.NODE_ENV !== 'production'
} satisfies NextAuthOptions

export function auth(
    ...args:
        | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
        | [NextApiRequest, NextApiResponse]
        | []
) {
    return getServerSession(...args, config)
}
