// Minimal Worker platform types to avoid depending on @cloudflare/workers-types during tests
type KVNamespace = {
    get(key: string): Promise<string | null>;
    put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
};

type Fetcher = {
    fetch(request: Request): Promise<Response>;
};

type ScheduledEvent = {
    readonly scheduledTime: number;
    readonly cron: string;
    waitUntil(promise: Promise<any>): void;
};

export interface Env {
    YOUTUBE_FEED_KV: KVNamespace;
    YOUTUBE_API_KEY?: string;
    YOUTUBE_PLAYLIST_ID?: string;
    YOUTUBE_CHANNEL_ID?: string;
    YOUTUBE_RSS_URL?: string;
    ASSETS: Fetcher;
}

type ThumbnailSet = {
    default?: string;
    medium?: string;
    high?: string;
};

export type NormalizedVideo = {
    id: string;
    title: string;
    publishedAt: string;
    url: string;
    thumbnails: ThumbnailSet;
};

type FeedPayload = {
    updatedAt: string;
    items: NormalizedVideo[];
    version: number;
};

const FEED_KEY = 'youtube:feed';
const VERSION_KEY = 'youtube:feed:version';
const MAX_RESULTS = 50;

const selectThumbnail = (thumbs?: Record<string, { url: string } | undefined>): ThumbnailSet => ({
    default: thumbs?.default?.url,
    medium: thumbs?.medium?.url ?? thumbs?.standard?.url,
    high: thumbs?.high?.url ?? thumbs?.maxres?.url,
});

const normalizePlaylistItem = (item: any): NormalizedVideo | null => {
    const snippet = item?.snippet;
    const videoId = snippet?.resourceId?.videoId ?? item?.id;

    if (!snippet || !videoId) {
        return null;
    }

    return {
        id: videoId,
        title: snippet.title,
        publishedAt: snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnails: selectThumbnail(snippet.thumbnails),
    };
};

const normalizeRssEntry = (entry: Element): NormalizedVideo | null => {
    const text = (selector: string) => entry.querySelector(selector)?.textContent?.trim();
    const id = text('yt\\:videoId') ?? text('id');
    const title = text('title');
    const publishedAt = text('published') ?? '';
    const link = entry.querySelector('link')?.getAttribute('href');
    const thumbnail = entry.querySelector('media\\:thumbnail')?.getAttribute('url');

    if (!id || !title) {
        return null;
    }

    return {
        id,
        title,
        publishedAt,
        url: link ?? `https://www.youtube.com/watch?v=${id}`,
        thumbnails: {
            default: thumbnail ?? undefined,
        },
    };
};

const fetchFromDataApi = async (env: Env): Promise<NormalizedVideo[]> => {
    const apiKey = env.YOUTUBE_API_KEY;
    const playlistId = env.YOUTUBE_PLAYLIST_ID;

    if (!apiKey || !playlistId) {
        return [];
    }

    let pageToken: string | undefined;
    const collected: NormalizedVideo[] = [];

    do {
        const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
        url.searchParams.set('part', 'snippet');
        url.searchParams.set('playlistId', playlistId);
        url.searchParams.set('maxResults', String(MAX_RESULTS));
        url.searchParams.set('key', apiKey);
        if (pageToken) {
            url.searchParams.set('pageToken', pageToken);
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`YouTube API error ${response.status}`);
        }

        const payload = await response.json();
        const items = Array.isArray(payload.items) ? payload.items : [];
        items.forEach((item) => {
            const normalized = normalizePlaylistItem(item);
            if (normalized) {
                collected.push(normalized);
            }
        });

        pageToken = payload.nextPageToken;
    } while (pageToken);

    return collected;
};

const fetchFromRss = async (env: Env): Promise<NormalizedVideo[]> => {
    const rssUrl = env.YOUTUBE_RSS_URL ||
        (env.YOUTUBE_CHANNEL_ID
            ? `https://www.youtube.com/feeds/videos.xml?channel_id=${env.YOUTUBE_CHANNEL_ID}`
            : null);

    if (!rssUrl) {
        return [];
    }

    const response = await fetch(rssUrl, {
        headers: {
            Accept: 'application/atom+xml, application/xml',
        },
    });

    if (!response.ok) {
        throw new Error(`YouTube RSS error ${response.status}`);
    }

    const xmlText = await response.text();
    const doc = new DOMParser().parseFromString(xmlText, 'text/xml');
    const entries = Array.from(doc.getElementsByTagName('entry'));

    return entries
        .map((entry) => normalizeRssEntry(entry))
        .filter((item): item is NormalizedVideo => Boolean(item));
};

const fetchYouTubeFeed = async (env: Env): Promise<FeedPayload> => {
    const updatedAt = new Date().toISOString();

    try {
        const apiItems = await fetchFromDataApi(env);
        if (apiItems.length) {
            return { updatedAt, items: apiItems, version: Date.now() };
        }
    } catch (error) {
        console.error('Falling back to RSS after API error', error);
    }

    const rssItems = await fetchFromRss(env);
    return { updatedAt, items: rssItems, version: Date.now() };
};

const storeFeed = async (env: Env, payload: FeedPayload) => {
    await env.YOUTUBE_FEED_KV.put(FEED_KEY, JSON.stringify(payload), { expirationTtl: 60 * 60 * 24 });
    await env.YOUTUBE_FEED_KV.put(VERSION_KEY, String(payload.version));
};

const readFeed = async (env: Env): Promise<FeedPayload | null> => {
    const stored = await env.YOUTUBE_FEED_KV.get(FEED_KEY);
    if (!stored) {
        return null;
    }

    try {
        return JSON.parse(stored) as FeedPayload;
    } catch (error) {
        console.error('Unable to parse stored feed', error);
        return null;
    }
};

const buildResponse = (payload: FeedPayload | null, limit?: number) => {
    if (!payload || payload.items.length === 0) {
        return new Response(JSON.stringify({ message: 'YouTube feed not yet available', items: [] }), {
            status: 200,
            headers: {
                'content-type': 'application/json',
                'cache-control': 'no-store',
            },
        });
    }

    const items = typeof limit === 'number' && limit > 0 ? payload.items.slice(0, limit) : payload.items;

    return new Response(
        JSON.stringify({ ...payload, items }),
        {
            status: 200,
            headers: {
                'content-type': 'application/json',
                'cache-control': 'public, max-age=300, s-maxage=600',
            },
        }
    );
};

const handleFetch = async (request: Request, env: Env): Promise<Response> => {
    const url = new URL(request.url);

    if (url.pathname === '/api/youtube-feed') {
        const limit = url.searchParams.get('limit');
        const parsedLimit = limit ? Number.parseInt(limit, 10) : undefined;
        const feed = await readFeed(env);
        return buildResponse(feed, Number.isNaN(parsedLimit) ? undefined : parsedLimit);
    }

    return env.ASSETS.fetch(request);
};

const handleScheduled = async (event: ScheduledEvent, env: Env) => {
    const run = (async () => {
        try {
            const payload = await fetchYouTubeFeed(env);
            await storeFeed(env, payload);
        } catch (error) {
            console.error('Scheduled YouTube feed refresh failed', error);
        }
    })();

    event.waitUntil(run);
    return run;
};

export default {
    fetch: handleFetch,
    scheduled: handleScheduled,
};

export { fetchYouTubeFeed, buildResponse };
