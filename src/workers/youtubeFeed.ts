import { applySecurityHeaders } from './securityHeaders';

// Minimal Worker platform types to avoid depending on @cloudflare/workers-types during tests
type KVNamespace = {
    get(key: string): Promise<string | null>;
    put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
};

type Fetcher = {
    fetch(request: Request): Promise<Response>;
};

type ScheduledController = {
    readonly scheduledTime: number;
    readonly cron: string;
    noRetry?: () => void;
};

type ExecutionContext = {
    waitUntil(promise: Promise<any>): void;
};

export interface Env {
    YOUTUBE_FEED_KV: KVNamespace;
    YOUTUBE_API_KEY?: string;
    YOUTUBE_PLAYLIST_ID?: string;
    YOUTUBE_CHANNEL_ID?: string;
    YOUTUBE_RSS_URL?: string;
    ASSETS?: Fetcher;
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
const LAST_CRON_KEY = 'youtube:feed:last_cron';
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

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const decodeXmlEntities = (value: string) => value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');

const normalizeXmlText = (value: string) => {
    const trimmed = value.trim();
    const cdataMatch = trimmed.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
    const cleaned = cdataMatch ? cdataMatch[1] : trimmed;
    return decodeXmlEntities(cleaned);
};

const extractTagText = (xml: string, tag: string): string | null => {
    const tagName = escapeRegExp(tag);
    const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
    const match = xml.match(regex);
    return match ? normalizeXmlText(match[1]) : null;
};

const extractTagAttribute = (
    xml: string,
    tag: string,
    attr: string,
    required?: { name: string; value: string }
): string | null => {
    const tagName = escapeRegExp(tag);
    const tagRegex = new RegExp(`<${tagName}\\b[^>]*>`, 'gi');
    const attrName = escapeRegExp(attr);
    let match: RegExpExecArray | null;
    while ((match = tagRegex.exec(xml))) {
        const tagText = match[0];
        if (required) {
            const requiredMatch = tagText.match(
                new RegExp(`${escapeRegExp(required.name)}\\s*=\\s*"([^"]*)"`, 'i')
            );
            if (!requiredMatch || requiredMatch[1] !== required.value) {
                continue;
            }
        }
        const attrMatch = tagText.match(new RegExp(`${attrName}\\s*=\\s*"([^"]*)"`, 'i'));
        if (attrMatch) {
            return normalizeXmlText(attrMatch[1]);
        }
    }
    return null;
};

const extractEntries = (xmlText: string) => {
    const entries: string[] = [];
    const entryRegex = /<entry\b[^>]*>([\s\S]*?)<\/entry>/gi;
    let match: RegExpExecArray | null;
    while ((match = entryRegex.exec(xmlText))) {
        entries.push(match[1]);
    }
    return entries;
};

const normalizeRssEntry = (entryXml: string): NormalizedVideo | null => {
    const rawId = extractTagText(entryXml, 'yt:videoId') ?? extractTagText(entryXml, 'id');
    const id = rawId ? rawId.split(':').pop() ?? rawId : null;
    const title = extractTagText(entryXml, 'title');
    const publishedAt = extractTagText(entryXml, 'published') ?? '';
    const link = extractTagAttribute(entryXml, 'link', 'href', { name: 'rel', value: 'alternate' }) ??
        extractTagAttribute(entryXml, 'link', 'href');
    const thumbnail = extractTagAttribute(entryXml, 'media:thumbnail', 'url');

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
    const entries = extractEntries(xmlText);

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

const isHtmlRequest = (request: Request) => {
    const acceptHeader = request.headers.get('accept') ?? '';

    return request.method === 'GET' && acceptHeader.includes('text/html');
};

const fetchAssetWithSpaFallback = async (request: Request, env: Env): Promise<Response> => {
    if (!env.ASSETS?.fetch) {
        return new Response('Not Found', { status: 404 });
    }

    try {
        const assetResponse = await env.ASSETS.fetch(request);

        if (assetResponse.status === 404 && isHtmlRequest(request)) {
            const indexRequest = new Request(new URL('/index.html', request.url).toString(), {
                headers: request.headers,
            });

            return env.ASSETS.fetch(indexRequest);
        }

        return assetResponse;
    } catch (error) {
        console.error('Asset fetch failed', error);

        if (isHtmlRequest(request)) {
            try {
                const indexRequest = new Request(new URL('/index.html', request.url).toString(), {
                    headers: request.headers,
                });

                return env.ASSETS.fetch(indexRequest);
            } catch (fallbackError) {
                console.error('Fallback index fetch failed', fallbackError);
            }
        }

        return new Response('Internal server error', { status: 500 });
    }
};

const handleFetch = async (request: Request, env: Env): Promise<Response> => {
    const url = new URL(request.url);

    if (url.protocol === 'http:') {
        const httpsUrl = new URL(request.url);
        httpsUrl.protocol = 'https:';

        return applySecurityHeaders(
            new Response(null, {
                status: 308,
                headers: { Location: httpsUrl.toString() },
            })
        );
    }

    if (url.pathname === '/api/youtube-feed') {
        const limit = url.searchParams.get('limit');
        const parsedLimit = limit ? Number.parseInt(limit, 10) : undefined;
        let feed = await readFeed(env);

        if (!feed || feed.items.length === 0) {
            try {
                const refreshed = await fetchYouTubeFeed(env);
                if (refreshed.items.length > 0) {
                    await storeFeed(env, refreshed);
                }
                feed = refreshed;
            } catch (error) {
                console.error('On-demand YouTube feed refresh failed', error);
            }
        }

        return applySecurityHeaders(buildResponse(feed, Number.isNaN(parsedLimit) ? undefined : parsedLimit));
    }

    const assetResponse = await fetchAssetWithSpaFallback(request, env);
    return applySecurityHeaders(assetResponse);
};

const refreshScheduledFeed = async (env: Env) => {
    try {
        const payload = await fetchYouTubeFeed(env);
        await storeFeed(env, payload);
    } catch (error) {
        console.error('Scheduled YouTube feed refresh failed', error);
    }
};

const runScheduledRefresh = async (env: Env, cron: string) => {
    if (!env.YOUTUBE_FEED_KV) {
        return;
    }

    await env.YOUTUBE_FEED_KV.put(LAST_CRON_KEY, cron);
    await refreshScheduledFeed(env);
};

const handleScheduled = (controller: ScheduledController, env: Env, ctx: ExecutionContext) => {
    const cron = controller.cron;

    if (!env.YOUTUBE_FEED_KV) {
        return;
    }

    console.log('scheduled refresh', { cron });
    ctx.waitUntil(runScheduledRefresh(env, cron));
};

export default {
    fetch: handleFetch,
    scheduled: handleScheduled,
};

export { fetchYouTubeFeed, buildResponse };
