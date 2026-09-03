import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

import {
    Env,
    FeedPayload,
    fetchYouTubeFeed,
    handleFetch,
    refreshScheduledFeed,
} from '../src/workers/youtubeFeed';

class MemoryKv {
    readonly values = new Map<string, string>();

    async get(key: string) {
        return this.values.get(key) ?? null;
    }

    async put(key: string, value: string) {
        this.values.set(key, value);
    }
}

const loadFixture = (): FeedPayload => {
    const fixturePath = resolve(process.cwd(), 'tests', '__fixtures__', 'youtubeFeedSample.json');
    return JSON.parse(readFileSync(fixturePath, 'utf8')) as FeedPayload;
};

const createEnv = (kv: MemoryKv, assets?: Env['ASSETS']): Env => ({
    YOUTUBE_FEED_KV: kv,
    ASSETS: assets ?? { fetch: async () => new Response('Not found', { status: 404 }) },
});

test('serves the stored feed through the real worker handler', async () => {
    const kv = new MemoryKv();
    kv.values.set('youtube:feed', JSON.stringify(loadFixture()));

    const response = await handleFetch(
        new Request('https://duriin.com/api/youtube-feed?limit=1'),
        createEnv(kv)
    );
    const payload = await response.json() as FeedPayload;

    assert.equal(response.status, 200);
    assert.equal(payload.items.length, 1);
    assert.equal(payload.items[0].id, 'abc123');
    assert.match(response.headers.get('content-security-policy') ?? '', /default-src 'self'/);
});

test('preserves the last-known-good feed when a refresh is empty', async () => {
    const kv = new MemoryKv();
    const fixture = loadFixture();
    const stored = JSON.stringify(fixture);
    kv.values.set('youtube:feed', stored);
    const env = { ...createEnv(kv), YOUTUBE_RSS_URL: 'https://example.test/feed.xml' };
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response('<feed></feed>', { status: 200 });

    try {
        await refreshScheduledFeed(env);
    } finally {
        globalThis.fetch = originalFetch;
    }

    assert.equal(kv.values.get('youtube:feed'), stored);
});

test('caps Data API fetching at the 50-item consumer bound', async () => {
    const kv = new MemoryKv();
    const env: Env = {
        ...createEnv(kv),
        YOUTUBE_API_KEY: 'test-key',
        YOUTUBE_PLAYLIST_ID: 'test-playlist',
    };
    const originalFetch = globalThis.fetch;
    let requestCount = 0;
    globalThis.fetch = async () => {
        requestCount += 1;
        return Response.json({
            nextPageToken: 'unused-page',
            items: [
                {
                    snippet: {
                        resourceId: { videoId: 'video-1' },
                        title: 'Video one',
                        publishedAt: '2025-01-01T00:00:00Z',
                        thumbnails: { default: { url: 'https://i.ytimg.com/example.jpg' } },
                    },
                },
            ],
        });
    };

    let payload: FeedPayload;
    try {
        payload = await fetchYouTubeFeed(env);
    } finally {
        globalThis.fetch = originalFetch;
    }

    assert.equal(requestCount, 1);
    assert.equal(payload.items[0].id, 'video-1');
});

test('applies SPA fallback, security headers, and path-safe caching', async () => {
    const kv = new MemoryKv();
    const requestedPaths: string[] = [];
    const env = createEnv(kv, {
        fetch: async (request) => {
            const pathname = new URL(request.url).pathname;
            requestedPaths.push(pathname);

            if (pathname === '/index.html') {
                return new Response('<!doctype html>', {
                    headers: { 'content-type': 'text/html', 'cache-control': 'public, max-age=3600' },
                });
            }
            if (pathname.startsWith('/assets/')) {
                return new Response('export {};', { headers: { 'content-type': 'text/javascript' } });
            }
            if (pathname === '/theme-init.js') {
                return new Response('(() => {})();', {
                    headers: { 'content-type': 'text/javascript', 'cache-control': 'public, max-age=3600' },
                });
            }
            return new Response('Not found', { status: 404 });
        },
    });

    const page = await handleFetch(
        new Request('https://duriin.com/videos', { headers: { accept: 'text/html' } }),
        env
    );
    assert.equal(page.status, 200);
    assert.equal(page.headers.get('cache-control'), 'no-cache');
    assert.deepEqual(requestedPaths.slice(0, 2), ['/videos', '/index.html']);
    const csp = page.headers.get('content-security-policy') ?? '';
    assert.match(csp, /https:\/\/\*\.ytimg\.com/);
    assert.match(csp, /https:\/\/www\.youtube-nocookie\.com/);
    assert.doesNotMatch(csp, /script-src[^;]*'unsafe-inline'/);

    const asset = await handleFetch(new Request('https://duriin.com/assets/index-AbCd1234.js'), env);
    assert.equal(asset.headers.get('cache-control'), 'public, max-age=31536000, immutable');

    const bootstrap = await handleFetch(new Request('https://duriin.com/theme-init.js'), env);
    assert.equal(bootstrap.headers.get('cache-control'), 'no-cache');
});
