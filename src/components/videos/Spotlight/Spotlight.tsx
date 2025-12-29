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
        useEffect(() => {
            if (variant !== 'overlay') {
                return;
            }

            const previousOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.overflow = previousOverflow;
            };
        }, [variant]);

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

        if (variant === 'overlay') {
            return (
                <div className="spotlight-overlay" role="dialog" aria-modal="true" aria-label="Spotlight video">
                    <button
                        type="button"
                        className="spotlight-overlay__backdrop"
                        aria-label="Exit Spotlight"
                        onClick={onExit}
                    />
                    <div className="spotlight-overlay__panel" onClick={(event) => event.stopPropagation()}>
                        {content}
                    </div>
                </div>
            );
        }

        return (
            <div className="spotlight-row" ref={ref}>
                {content}
            </div>
        );
    }
);

Spotlight.displayName = 'Spotlight';
