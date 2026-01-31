import {DefaultSession} from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id?: string
            firstName?: string
            lastName?: string
            groups?: string[]
        } & DefaultSession["user"]
    }

    interface JWT {
        sub?: string
        firstName?: string
        lastName?: string
        groups?: string[]
    }

    interface Profile {
        sub?: string
        given_name?: string
        family_name?: string
        groups?: string[]
    }

    interface User {
        id?: string
        firstName?: string
        lastName?: string
        groups?: string[]
    }
}