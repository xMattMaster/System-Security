import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { refreshKeycloakAgent } from '@/lib/auth';
import { refreshPgPool } from '@/lib/pgpool';

export async function POST() {
    const headerStore = await headers();
    const host = headerStore.get('host');
    const xRealIP = headerStore.get('x-real-ip') || headerStore.get('x-forwarded-for');

    const allowedHosts = ['localhost', '127.0.0.1', '::1'];
    const clientIP = xRealIP?.split(',')[0].trim() || 'unknown';

    if (!allowedHosts.includes(host || '') && !allowedHosts.includes(clientIP)) {
        return new NextResponse('Forbidden', { status: 403 });
    }
    try {
        refreshKeycloakAgent();
        await refreshPgPool();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Reload failed:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function GET() {
    return new NextResponse('Forbidden', { status: 403 });
}
