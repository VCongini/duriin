// Fetches platform content and normalizes into src/content/videos.json
// Supports: YouTube (uploads), Twitch VODs. TikTok remains manual for now.
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const videosPath = path.join(root, 'src/content/videos.json');

let env = {
    youtubeApiKey: process.env.VITE_YOUTUBE_API_KEY,
    youtubeChannelId: process.env.VITE_YOUTUBE_CHANNEL_ID,
    twitchClientId: process.env.TWITCH_CLIENT_ID,
    twitchClientSecret: process.env.TWITCH_CLIENT_SECRET,
    twitchUserId: process.env.TWITCH_USER_ID
};

const loadLocalEnv = async () => {
    const candidates = ['.env.local', '.env'];
    for (const filename of candidates) {
        const filePath = path.join(root, filename);
        try {
            const raw = await fs.readFile(filePath, 'utf8');
            raw.split(/\r?\n/).forEach((line) => {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return;
                const [key, ...rest] = trimmed.split('=');
                if (!process.env[key]) {
                    process.env[key] = rest.join('=').trim();
                }
            });
            break;
        } catch {
            // ignore missing file
        }
    }

    env = {
        youtubeApiKey: process.env.VITE_YOUTUBE_API_KEY,
        youtubeChannelId: process.env.VITE_YOUTUBE_CHANNEL_ID,
        twitchClientId: process.env.TWITCH_CLIENT_ID,
        twitchClientSecret: process.env.TWITCH_CLIENT_SECRET,
        twitchUserId: process.env.TWITCH_USER_ID
    };
};

const readExisting = async () => {
    try {
        const data = await fs.readFile(videosPath, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
};

const writeVideos = async (videos) => {
    const sorted = [...videos].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    await fs.writeFile(videosPath, JSON.stringify(sorted, null, 4) + '\n', 'utf8');
};

const isoDurationToClock = (iso) => {
    // Converts PT#H#M#S to hh:mm:ss or mm:ss
    const match =
        /P(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?/i.exec(iso) ||
        /(\d+)h(\d+)m(\d+)s/i.exec(iso);
    if (!match) return '';
    const [_, hRaw, mRaw, sRaw] = match;
    const h = Number(hRaw || 0);
    const m = Number(mRaw || 0);
    const s = Number(sRaw || 0);
    const parts = [];
    if (h) parts.push(String(h));
    parts.push(String(m).padStart(2, '0'));
    parts.push(String(Math.floor(s)).padStart(2, '0'));
    return parts.join(':');
};

const truncate = (text, limit = 220) => {
    if (!text) return '';
    if (text.length <= limit) return text;
    return text.slice(0, limit - 1).trimEnd() + '…';
};

const fetchJson = async (url, opts = {}) => {
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);
    return res.json();
};

const fetchYouTubeUploads = async (existingLookup) => {
    if (!env.youtubeApiKey || !env.youtubeChannelId) {
        console.log('YouTube: missing VITE_YOUTUBE_API_KEY or VITE_YOUTUBE_CHANNEL_ID, skipping.');
        return [];
    }
    console.log('YouTube: fetching uploads…');
    const channelData = await fetchJson(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${env.youtubeChannelId}&key=${env.youtubeApiKey}`
    );
    const uploadsId =
        channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ||
        channelData.items?.[0]?.id;
    if (!uploadsId) {
        console.log('YouTube: uploads playlist not found, skipping.');
        return [];
    }
    const playlistData = await fetchJson(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsId}&maxResults=10&key=${env.youtubeApiKey}`
    );
    const ids = playlistData.items?.map((item) => item.contentDetails?.videoId).filter(Boolean) || [];
    if (!ids.length) return [];
    const videosData = await fetchJson(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${ids.join(',')}&key=${env.youtubeApiKey}`
    );
    return videosData.items
        ?.map((item) => {
            const duration = isoDurationToClock(item.contentDetails?.duration || '');
            const id = item.id;
            const thumbnail =
                item.snippet?.thumbnails?.maxres?.url ||
                item.snippet?.thumbnails?.standard?.url ||
                item.snippet?.thumbnails?.high?.url ||
                item.snippet?.thumbnails?.medium?.url ||
                item.snippet?.thumbnails?.default?.url;
            return {
                id,
                episode: existingLookup.get(id)?.episode || 'YOUTUBE',
                title: item.snippet?.title || 'Untitled',
                platform: 'YouTube',
                url: `https://www.youtube.com/watch?v=${id}`,
                embedUrl: `https://www.youtube.com/embed/${id}`,
                thumbnailUrl: thumbnail,
                duration: duration || '00:00',
                status: 'LIVE',
                tags: item.snippet?.tags?.slice(0, 6) || existingLookup.get(id)?.tags || [],
                description: truncate(item.snippet?.description || existingLookup.get(id)?.description || ''),
                viewCount: Number(item.statistics?.viewCount) || existingLookup.get(id)?.viewCount,
                publishedAt: item.snippet?.publishedAt || existingLookup.get(id)?.publishedAt || ''
            };
        })
        .filter((v) => v.publishedAt);
};

const fetchTwitchVods = async (existingLookup) => {
    if (!env.twitchClientId || !env.twitchClientSecret || !env.twitchUserId) {
        console.log('Twitch: missing credentials, skipping.');
        return [];
    }
    console.log('Twitch: fetching VODs…');
    const tokenRes = await fetchJson(
        `https://id.twitch.tv/oauth2/token?client_id=${env.twitchClientId}&client_secret=${env.twitchClientSecret}&grant_type=client_credentials`,
        { method: 'POST' }
    );
    const authHeaders = {
        'Client-ID': env.twitchClientId,
        Authorization: `Bearer ${tokenRes.access_token}`
    };
    const vodsData = await fetchJson(
        `https://api.twitch.tv/helix/videos?user_id=${env.twitchUserId}&type=archive&first=5`,
        { headers: authHeaders }
    );
    return (vodsData.data || []).map((vod) => {
        const duration = isoDurationToClock(vod.duration);
        const id = vod.id;
        return {
            id: `twitch-${id}`,
            episode: existingLookup.get(`twitch-${id}`)?.episode || 'TWITCH_VOD',
            title: vod.title || 'Twitch VOD',
            platform: 'Twitch',
            url: vod.url,
            duration: duration || '00:00',
            status: 'ARCHIVED',
            tags: existingLookup.get(`twitch-${id}`)?.tags || ['twitch', 'vod'],
            publishedAt: vod.published_at
        };
    });
};

const mergeContent = (existing, incoming) => {
    const incomingIds = new Set(incoming.map((v) => v.id));
    const preserved = existing.filter((v) => !incomingIds.has(v.id) && v.platform === 'TikTok');
    return [...incoming, ...preserved];
};

const main = async () => {
    await loadLocalEnv();
    const existing = await readExisting();
    const existingLookup = new Map(existing.map((v) => [v.id, v]));
    const youtube = await fetchYouTubeUploads(existingLookup);
    const twitch = await fetchTwitchVods(existingLookup);
    const combined = mergeContent(existing, [...youtube, ...twitch]);
    await writeVideos(combined);
    console.log(`Content sync complete. Total videos: ${combined.length}`);
};

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
