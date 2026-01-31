import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const requestCounts = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(req: NextRequest): string {
    return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
           req.ip || 
           'unknown';
}

function checkRateLimit(key: string, limit: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now();
    const entry = requestCounts.get(key);

    if (!entry || now > entry.resetTime) {
        requestCounts.set(key, {
            count: 1,
            resetTime: now + windowMs
        });
        return true;
    }

    if (entry.count >= limit) {
        return false;
    }

    entry.count++;
    return true;
}

export default withAuth(
    function middleware(req: NextRequest) {
        const requestHeaders = new Headers(req.headers);
        const response = NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });

        // Rate limiting
        const rateLimitKey = getRateLimitKey(req);
        const isAllowed = checkRateLimit(rateLimitKey, 100, 60000); // 100 req/min

        if (!isAllowed) {
            return new NextResponse('Too Many Requests', {
                status: 429,
                headers: {
                    'Retry-After': '60'
                }
            });
        }

        const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
        const isDev = process.env.NODE_ENV === 'development';
        
        // Build connect-src with websocket support in dev
        const connectSrc = ["'self'"];
        if (isDev) connectSrc.push('ws:', 'wss:');

        const cspHeaderReadable = `
            default-src 'self';
            script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''};
            style-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-inline'" : ''};
            img-src 'self';
            font-src 'self' data:;
            connect-src ${connectSrc.join(' ')};
            frame-src 'none';
            frame-ancestors 'none';
            base-uri 'self';
            form-action 'self';
            object-src 'none';
            upgrade-insecure-requests;
            block-all-mixed-content;
        `;

        const cspHeader = cspHeaderReadable
            .replace(/\s{2,}/g, ' ')
            .trim();

        requestHeaders.set('x-nonce', nonce);
        response.headers.set('x-nonce', nonce);
        response.headers.set('Content-Security-Policy', cspHeader);

        // Security headers (ridondanti ma ulteriore protezione)
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-XSS-Protection', '1; mode=block');
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
        response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
        response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

        // Rimuovi header che espongono informazioni
        response.headers.delete('X-Powered-By');
        response.headers.delete('Server');

        // Aggiungi timestamp per tracking (solo in dev)
        if (process.env.NODE_ENV !== 'production') {
            response.headers.set('X-Request-Time', new Date().toISOString());
        }

        return response;
    },
    {
        pages: {
            signIn: "/api/auth/signin/keycloak"
        },
        callbacks: {
            authorized: ({ token, req }) => {
                const p = req.nextUrl.pathname || '';
                const protectedPath = p.startsWith('/dashboard') || p.startsWith('/api');
                if (!protectedPath) return true;
                return !!token;
            }
        }
    }
)

export const config = {
    matcher: [
        // Applica CSP ovunque, escludendo asset statici e file metadata comuni
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
        // Mantieni protezione su API
        '/api/:path*',
    ] 
}
