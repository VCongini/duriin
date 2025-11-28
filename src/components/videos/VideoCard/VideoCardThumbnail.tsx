import React from 'react';

export interface VideoCardThumbnailProps {
    thumbnailUrl?: string;
    platform: string;
    title: string;
    isActive: boolean;
    onSelect: () => void;
}

export const VideoCardThumbnail: React.FC<VideoCardThumbnailProps> = ({
    thumbnailUrl,
    platform,
    title,
    isActive,
    onSelect
}) => (
    <button
        type="button"
        className="video-card__media"
        onClick={onSelect}
        aria-label={`Preview ${title} in the player`}
        aria-pressed={isActive}
    >
        {thumbnailUrl ? (
            <img src={thumbnailUrl} alt="" loading="lazy" />
        ) : (
            <div className="video-card__placeholder">{platform}</div>
        )}
    </button>
);
