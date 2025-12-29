import React, { useEffect, useMemo } from 'react';
import { Video } from '../../../content/types';
import { VideoCardMeta } from '../VideoCard/VideoCardMeta';

export interface SpotlightProps {
    variant: 'row' | 'overlay';
    video: Video;
    onExit: () => void;
}

const SpotlightPlayer: React.FC<{ embedUrl?: string; title: string; url: string }> = ({
    embedUrl,
    title,
    url
}) => {
    const embedSrc = useMemo(() => {
        if (!embedUrl) {
            return null;
        }

        const params = ['autoplay=1', 'rel=0', 'controls=1'];
        return `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}${params.join('&')}`;
    }, [embedUrl]);

    if (!embedSrc) {
        return (
            <a className="spotlight__fallback" href={url} target="_blank" rel="noreferrer">
                Watch on YouTube
            </a>
        );
    }

    return (
        <div className="spotlight-player">
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

export const Spotlight = React.forwardRef<HTMLDivElement, SpotlightProps>(
    ({ variant, video, onExit }, ref) => {
        const isOverlay = variant === 'overlay';

        useEffect(() => {
            if (!isOverlay) {
                return;
            }

            const previousOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.overflow = previousOverflow;
            };
        }, [isOverlay]);

        const content = (
            <div className="spotlight__content u-stack">
                <header className="spotlight__header">
                    <div className="spotlight__titles">
                        <p className="spotlight__eyebrow">{video.platform}</p>
                        <h2 className="spotlight__title">{video.title}</h2>
                    </div>
                    <button type="button" className="btn btn--ghost" onClick={onExit}>
                        Exit Spotlight
                    </button>
                </header>
                <SpotlightPlayer embedUrl={video.embedUrl} title={video.title} url={video.url} />
                <div className="spotlight__meta">
                    <VideoCardMeta duration={video.duration} publishedAt={video.publishedAt} showTags={false} />
                </div>
            </div>
        );

        return (
            <div
                className={`spotlight ${isOverlay ? 'spotlight--overlay' : 'spotlight--row'}`}
                role={isOverlay ? 'dialog' : undefined}
                aria-modal={isOverlay ? 'true' : undefined}
                aria-label={isOverlay ? 'Spotlight video' : undefined}
                ref={ref}
            >
                {isOverlay ? (
                    <button
                        type="button"
                        className="spotlight__backdrop"
                        aria-label="Exit Spotlight"
                        onClick={onExit}
                    />
                ) : null}
                <div
                    className={`spotlight__panel ${isOverlay ? 'spotlight__panel--overlay' : ''}`}
                    onClick={isOverlay ? (event) => event.stopPropagation() : undefined}
                >
                    {content}
                </div>
            </div>
        );
    }
);

Spotlight.displayName = 'Spotlight';
