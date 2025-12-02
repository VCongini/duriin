import React, { useMemo } from 'react';

export interface VideoCardThumbnailProps {
    thumbnailUrl?: string;
    platform: string;
    title: string;
    embedUrl?: string;
    externalUrl: string;
    isPlaying: boolean;
    onPlay: () => void;
    duration?: string;
    isViewed: boolean;
}

export const VideoCardThumbnail: React.FC<VideoCardThumbnailProps> = ({
    thumbnailUrl,
    platform,
    title,
    embedUrl,
    externalUrl,
    isPlaying,
    onPlay,
    duration,
    isViewed
}) => (
    <div className={`video-card__media ${isViewed ? 'is-viewed' : ''} ${isPlaying ? 'is-playing' : ''}`} aria-live="polite">
        {isPlaying && embedUrl ? (
            <VideoCardEmbed embedUrl={embedUrl} title={title} />
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
                <span className="video-card__media-overlay" aria-hidden="true">
                    <span className="video-card__play-icon" aria-hidden="true">
                        <svg width="32" height="36" viewBox="0 0 32 36" role="presentation">
                            <path d="M30.68 16.68a2 2 0 010 2.64l-16.5 16.5A2 2 0 0110 34.5V1.5A2 2 0 0114.18.18z" />
                        </svg>
                    </span>
                    <span className="video-card__play-label">Play</span>
                </span>
                {duration ? <span className="video-card__duration">{duration}</span> : null}
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

interface VideoCardEmbedProps {
    embedUrl: string;
    title: string;
}

const VideoCardEmbed: React.FC<VideoCardEmbedProps> = ({ embedUrl, title }) => {
    const embedSrc = useMemo(() => {
        const params = ['autoplay=1', 'rel=0', 'controls=1'];

        return `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}${params.join('&')}`;
    }, [embedUrl]);

    return (
        <div className="video-card__player">
            <iframe
                src={embedSrc}
                title={title}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                loading="lazy"
            />
        </div>
    );
};
