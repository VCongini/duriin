export const createTeaser = (description: string, maxLength = 110): string => {
    const text = description?.trim();

    if (!text) return '';

    if (text.length <= maxLength) return text;

    const clipped = text.slice(0, maxLength).trimEnd();
    return clipped.replace(/[.,;:\-\s]+$/, '') + '…';
};

export const getExternalCtaLabel = (platform: string): string => platform;

export const formatRelativeDate = (iso: string): string => {
    const published = new Date(iso);
    const now = new Date();
    const diffDays = Math.max(0, Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24)));

    if (diffDays === 0) return 'Today';
    if (diffDays < 7) return `${diffDays}d ago`;

    const weeks = Math.floor(diffDays / 7);
    if (weeks < 5) return `${weeks}w ago`;

    const months = Math.floor(diffDays / 30);
    if (months < 12) return `${months}mo ago`;

    const years = Math.floor(diffDays / 365);
    return `${years}y ago`;
};

export const shouldShowStatus = (status?: string): boolean => Boolean(status && status.toLowerCase() !== 'live');
