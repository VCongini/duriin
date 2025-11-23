import videosData from './videos.json';
import postsData from './posts.json';
import { Video, Post } from './types';
export { featuredTopics } from './featured-topics';

const sortByDateDesc = <T extends { publishedAt: string }>(items: T[]): T[] =>
    [...items].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

export const videos = sortByDateDesc(videosData as Video[]);
export const posts = sortByDateDesc(postsData as Post[]);
