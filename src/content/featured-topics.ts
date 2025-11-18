import { FeaturedTopic } from './types';

export const featuredTopics: FeaturedTopic[] = [
    {
        id: 'builds',
        title: 'High-Impact Builds',
        description: 'Deep dives into brutalist systems and modern layouts, tuned for fast workflows.',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
        href: '/videos',
        ctaLabel: 'Watch breakdowns',
    },
    {
        id: 'stream',
        title: 'Streaming Setup',
        description: 'The exact capture, lighting, and audio stack that keeps the broadcast crystal.',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        href: '/about',
        ctaLabel: 'Review the rig',
    },
    {
        id: 'labs',
        title: 'Labs + Experiments',
        description: 'Unreleased tools, shader passes, and prototypes that power the channel.',
        image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
        href: 'https://www.youtube.com/@duriin',
        ctaLabel: 'See experiments',
    },
    {
        id: 'community',
        title: 'Community Drops',
        description: 'Spotlights on squad builds, fan art, and collabs pulled from the Discord.',
        image: 'https://images.unsplash.com/photo-1520607162513-6c284b56fefb?auto=format&fit=crop&w=1200&q=80',
        href: 'https://discord.com',
        ctaLabel: 'Join the drop',
    },
];
