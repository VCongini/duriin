const HASHED_ASSET_PATH = /^\/assets\/.+-[A-Za-z0-9_-]{8,}\.[^/]+$/;

const applySecurityHeaders = (response: Response, pathname = ''): Response => {
    const headers = new Headers(response.headers);

    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    headers.set(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            "script-src 'self'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' https://i.ytimg.com https://*.ytimg.com https://static-cdn.jtvnw.net data:",
            "connect-src 'self' https://www.googleapis.com https://www.youtube.com",
            'frame-src https://www.youtube.com https://www.youtube-nocookie.com https://player.twitch.tv',
            "font-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'self'",
            'upgrade-insecure-requests',
        ].join('; ')
    );
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'SAMEORIGIN');
    headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    if (HASHED_ASSET_PATH.test(pathname)) {
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (pathname === '/theme-init.js' || headers.get('Content-Type')?.includes('text/html')) {
        headers.set('Cache-Control', 'no-cache');
    }

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
};

export { applySecurityHeaders };
