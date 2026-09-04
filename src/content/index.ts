import announcementsData from './announcements.json';
import { Announcement, Video } from './types';
type YouTubeFeedItem = {
    id: string;
    title: string;
    publishedAt: string;
    url: string;
    thumbnails?: {
        default?: string;
        medium?: string;
        high?: string;
    };
};

type YouTubeFeedResponse = {
    updatedAt?: string;
    items?: YouTubeFeedItem[];
};

const sortByDateDesc = <T>(items: T[], key: keyof T): T[] =>
    [...items].sort((a, b) => new Date(String(b[key])).getTime() - new Date(String(a[key])).getTime());

let videosCache: Video[] | null = null;
let videosPromise: Promise<Video[]> | null = null;

// Keep videos.json in newest-first order to avoid extra runtime work; we still sort once as a fallback.
const sortVideos = (items: Video[]): Video[] => sortByDateDesc(items, 'publishedAt');
const sortAnnouncements = (items: Announcement[]): Announcement[] => sortByDateDesc(items, 'date');

const createVideoFromFeed = (item: YouTubeFeedItem, index: number, bundled?: Video): Video => ({
    ...bundled,
    id: item.id,
    episode: bundled?.episode ?? `VIDEO ${index + 1}`,
    title: item.title || bundled?.title || 'Untitled',
    platform: 'YouTube',
    url: item.url || bundled?.url || `https://www.youtube.com/watch?v=${item.id}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${item.id}`,
    thumbnailUrl:
        item.thumbnails?.high || item.thumbnails?.medium || item.thumbnails?.default || bundled?.thumbnailUrl,
    duration: bundled?.duration ?? '—',
    status: bundled?.status ?? 'ARCHIVED',
    tags: bundled?.tags ?? [],
    description: bundled?.description ?? `Watch ${item.title} on YouTube`,
    publishedAt: item.publishedAt || bundled?.publishedAt || '',
});

export const mergeRemoteVideos = (bundled: Video[], items: YouTubeFeedItem[]): Video[] => {
    const bundledById = new Map(bundled.map((video) => [video.id, video]));
    const remote = items.map((item, index) => createVideoFromFeed(item, index, bundledById.get(item.id)));
    const remoteIds = new Set(remote.map((video) => video.id));
    return sortVideos([...remote, ...bundled.filter((video) => !remoteIds.has(video.id))]);
};

const getFeedRequestUrl = () => {
    if (typeof window === 'undefined' || !window.location?.origin) {
        return null;
    }

    return new URL('/api/youtube-feed?limit=50', window.location.origin).toString();
};

const fetchRemoteVideos = async (bundled: Video[]): Promise<Video[]> => {
    const requestUrl = getFeedRequestUrl();
    if (!requestUrl) {
        return bundled;
    }

    const response = await fetch(requestUrl, { headers: { accept: 'application/json' } });

    if (!response.ok) {
        throw new Error(`Unable to fetch youtube feed (${response.status})`);
    }

    const payload = (await response.json()) as YouTubeFeedResponse;
    const items = payload.items ?? [];

    if (!items.length) {
        throw new Error('Feed was empty');
    }

    return mergeRemoteVideos(bundled, items);
};

const fetchLocalVideos = async (): Promise<Video[]> => {
    const module = await import('./videos.json');
    const videos = module.default as Video[];
    return sortVideos(videos);
};

export const getVideos = async (): Promise<Video[]> => {
    if (videosCache) {
        return videosCache;
    }

    if (!videosPromise) {
        videosPromise = (async (): Promise<Video[]> => {
            const local = await fetchLocalVideos();

            try {
                const remote = await fetchRemoteVideos(local);
                videosCache = remote;
                return remote;
            } catch (error) {
                console.warn('Falling back to bundled videos.json', error);
                videosCache = local;
                return local;
            }
        })().catch((error) => {
            videosPromise = null;
            throw error;
        });
    }

    return videosPromise;
};

export const announcements = sortAnnouncements(announcementsData as Announcement[]);
export const findAnnouncement = (id: string) => announcements.find((announcement) => announcement.id === id);
