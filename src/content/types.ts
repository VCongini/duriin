export type VideoStatus = 'LIVE' | 'ARCHIVED' | 'PREMIERE';

export type Video = {
    id: string;
    episode: string;
    title: string;
    platform: 'YouTube' | 'TikTok' | 'Twitch';
    url: string;
    embedUrl?: string;
    thumbnailUrl?: string;
    duration: string;
    status: VideoStatus;
    tags: string[];
    description?: string;
    viewCount?: number;
    publishedAt: string; // ISO date
};

export type Post = {
    id: string;
    title: string;
    url: string;
    publishedAt: string; // ISO date
    tags: string[];
    excerpt: string;
};

export type FeaturedTopic = {
    id: string;
    title: string;
    description: string;
    image: string;
    href: string;
    ctaLabel?: string;
};
