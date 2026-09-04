import { Video } from '../../content/types';

export type TagOption = {
    value: string;
    label: string;
};

const normalizeTag = (tag: string) => tag.trim().toLocaleLowerCase();

const casingScore = (tag: string) => [...tag].filter((character) => /[A-Z]/.test(character)).length;

export const getTagOptions = (videos: Array<Pick<Video, 'tags'>>): TagOption[] => {
    const labels = new Map<string, string>();

    videos.flatMap((video) => video.tags).forEach((tag) => {
        const label = tag.trim();
        const value = normalizeTag(label);
        const current = labels.get(value);

        if (value && (!current || casingScore(label) > casingScore(current))) {
            labels.set(value, label);
        }
    });

    return Array.from(labels, ([value, label]) => ({ value, label })).sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })
    );
};

export const videoHasTag = (video: Video, tag: string) => {
    const normalizedTag = normalizeTag(tag);
    return video.tags.some((candidate) => normalizeTag(candidate) === normalizedTag);
};
