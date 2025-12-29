import announcementsData from './announcements.json';
import { Announcement, Video } from './types';
export { featuredTopics } from './featured-topics';

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

const createVideoFromFeed = (item: YouTubeFeedItem, index: number): Video => ({
    id: item.id,
    episode: `VIDEO ${index + 1}`,
    title: item.title,
    platform: 'YouTube',
    url: item.url,
    embedUrl: `https://www.youtube.com/embed/${item.id}`,
    thumbnailUrl: item.thumbnails?.high || item.thumbnails?.medium || item.thumbnails?.default,
    duration: '—',
    status: 'ARCHIVED',
    tags: [],
    description: `Watch ${item.title} on YouTube`,
    publishedAt: item.publishedAt,
});

const getFeedBaseUrl = () => {
    if (typeof window !== 'undefined' && window.location?.origin) {
        return window.location.origin;
    }

    return 'http://localhost:5173';
};

const fetchRemoteVideos = async (): Promise<Video[]> => {
    const baseUrl = getFeedBaseUrl();
    const requestUrl = `${baseUrl}/api/youtube-feed?limit=50`;
    const response = await fetch(requestUrl, { headers: { accept: 'application/json' } });

    if (!response.ok) {
        throw new Error(`Unable to fetch youtube feed (${response.status})`);
    }

    const payload = (await response.json()) as YouTubeFeedResponse;
    const items = payload.items ?? [];

    if (!items.length) {
        throw new Error('Feed was empty');
    }

    return sortVideos(items.map((item, index) => createVideoFromFeed(item, index)));
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
        videosPromise = (async () => {
            try {
                const remote = await fetchRemoteVideos();
                videosCache = remote;
                return remote;
            } catch (error) {
                console.warn('Falling back to bundled videos.json', error);
                const local = await fetchLocalVideos();
                videosCache = local;
                return local;
            }
        })();
    }

    return videosPromise;
};

export const announcements = sortAnnouncements(announcementsData as Announcement[]);
export const findAnnouncement = (id: string) => announcements.find((announcement) => announcement.id === id);
