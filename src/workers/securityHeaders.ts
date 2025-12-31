const applySecurityHeaders = (response: Response): Response => {
    const headers = new Headers(response.headers);

    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    headers.set(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            "script-src 'self'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' https://i.ytimg.com data:",
            "connect-src 'self' https://www.googleapis.com https://www.youtube.com",
            'frame-src https://www.youtube.com',
            "font-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            'upgrade-insecure-requests',
        ].join('; ')
    );
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'SAMEORIGIN');
    headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
};

export { applySecurityHeaders };
