import announcementsData from './announcements.json';
import { Announcement, Video } from './types';
export { featuredTopics } from './featured-topics';

const sortByDateDesc = <T>(items: T[], key: keyof T): T[] =>
    [...items].sort((a, b) => new Date(String(b[key])).getTime() - new Date(String(a[key])).getTime());

let videosCache: Video[] | null = null;
let videosPromise: Promise<Video[]> | null = null;

// Keep videos.json in newest-first order to avoid extra runtime work; we still sort once as a fallback.
const sortVideos = (items: Video[]): Video[] => sortByDateDesc(items, 'publishedAt');
const sortAnnouncements = (items: Announcement[]): Announcement[] => sortByDateDesc(items, 'date');

export const getVideos = async (): Promise<Video[]> => {
    if (videosCache) {
        return videosCache;
    }

    if (!videosPromise) {
        videosPromise = import('./videos.json').then((module) => {
            const videos = sortVideos(module.default as Video[]);
            videosCache = videos;
            return videos;
        });
    }

    return videosPromise;
};

export const announcements = sortAnnouncements(announcementsData as Announcement[]);
export const findAnnouncement = (id: string) => announcements.find((announcement) => announcement.id === id);
