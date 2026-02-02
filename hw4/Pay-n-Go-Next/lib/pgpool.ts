"use server"

import "server-only"
import fs from "fs"
import {Pool, QueryResultRow} from "pg";
import {auth} from "@/lib/auth"

const g = globalThis as typeof globalThis & { __pgPool?: Pool }

declare global {
    var __pgPool: Pool;
}

export async function refreshPgPool() {
    const ssl = {
        ca: fs.readFileSync(process.env.POSTGRESQL_SSL_ROOTCERT as string).toString(),
        cert: fs.readFileSync(process.env.POSTGRESQL_SSL_CLIENTCERT as string).toString(),
        key: fs.readFileSync(process.env.POSTGRESQL_SSL_CLIENTKEY as string).toString(),
        rejectUnauthorized: true
    }

    if (g.__pgPool) {
        await g.__pgPool.end();
    }

    g.__pgPool = new Pool({
        host: process.env.POSTGRESQL_URL,
        port: parseInt(process.env.POSTGRESQL_PORT || ""),
        database: 'postgres',
        user: process.env.POSTGRESQL_USER,
        password: process.env.POSTGRESQL_PASSWORD,
        ssl
    });
}

async function getPool() {
    if (!g.__pgPool) {
        await refreshPgPool();
    }
    return g.__pgPool!;
}

export default async function pg_query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<{
    rows: T[]
}> {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized: No session found");
    }

    const userId = String(session.user.id).replace(/'/g, "''");
    if (!userId || userId.length === 0) {
        throw new Error("Invalid user ID");
    }

    const client = await (await getPool()).connect();
    try {
        await client.query("BEGIN")
        await client.query(`SET LOCAL app.user_id = '${userId}'`);
        let res = await client.query<T>(text, params)
        await client.query("COMMIT")
        return res
    } catch (err) {
        await client.query("ROLLBACK")
        throw err;
    } finally {
        client.release();
    }
}