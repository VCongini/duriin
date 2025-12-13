import postsData from './posts.json';
import { Post, Video } from './types';
export { featuredTopics } from './featured-topics';

const sortByDateDesc = <T extends { publishedAt: string }>(items: T[]): T[] =>
    [...items].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

let videosCache: Video[] | null = null;
let videosPromise: Promise<Video[]> | null = null;

// Keep videos.json in newest-first order to avoid extra runtime work; we still sort once as a fallback.
const sortVideos = (items: Video[]): Video[] => sortByDateDesc(items);

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

export const posts = sortByDateDesc(postsData as Post[]);
