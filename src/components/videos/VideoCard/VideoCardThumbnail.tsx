import React from 'react';

export interface VideoCardThumbnailProps {
    thumbnailUrl?: string;
    platform: string;
    title: string;
    embedUrl?: string;
    externalUrl: string;
    isPlaying: boolean;
    onPlay: () => void;
}

export const VideoCardThumbnail: React.FC<VideoCardThumbnailProps> = ({
    thumbnailUrl,
    platform,
    title,
    embedUrl,
    externalUrl,
    isPlaying,
    onPlay
}) => (
    <div className="video-card__media" aria-live="polite">
        {isPlaying && embedUrl ? (
            <iframe
                src={`${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1&rel=0`}
                title={title}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                loading="lazy"
            />
        ) : (
            <button
                type="button"
                className="video-card__media-trigger"
                onClick={onPlay}
                aria-label={`Play ${title}`}
                aria-pressed={isPlaying}
            >
                {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt="" loading="lazy" />
                ) : (
                    <div className="video-card__placeholder">{platform}</div>
                )}
                <span className="video-card__play">Play</span>
                {!embedUrl ? (
                    <span className="video-card__external-hint">Opens {platform}</span>
                ) : null}
            </button>
        )}
        {!embedUrl && isPlaying ? (
            <a
                className="video-card__external-link"
                href={externalUrl}
                target="_blank"
                rel="noreferrer"
            >
                Watch on {platform}
            </a>
        ) : null}
    </div>
);
