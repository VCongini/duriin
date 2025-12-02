import { useCallback, useState } from 'react';

const STORAGE_KEY = 'videos:viewed';

const readViewedFromStorage = (): Set<string> => {
    if (typeof window === 'undefined') {
        return new Set<string>();
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return new Set<string>();
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            return new Set<string>(parsed.filter((value): value is string => typeof value === 'string'));
        }
    } catch (error) {
        console.warn('Unable to read viewed videos from storage', error);
    }

    return new Set<string>();
};

const persistViewedToStorage = (ids: Set<string>) => {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
    } catch (error) {
        console.warn('Unable to persist viewed videos to storage', error);
    }
};

export const useViewedVideos = () => {
    const [viewed, setViewed] = useState<Set<string>>(() => readViewedFromStorage());

    const markViewed = useCallback((id: string) => {
        setViewed((current) => {
            if (current.has(id)) {
                return current;
            }

            const next = new Set(current);
            next.add(id);
            persistViewedToStorage(next);
            return next;
        });
    }, []);

    const isViewed = useCallback((id: string) => viewed.has(id), [viewed]);

    return { viewed, isViewed, markViewed } as const;
};
