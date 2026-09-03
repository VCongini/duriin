import React, { useEffect, useId, useMemo, useRef } from 'react';
import { Video } from '../../../content/types';
import { normalizeYouTubeEmbedUrl } from '../../../utils/video';
import { VideoCardMeta } from '../VideoCard/VideoCardMeta';

export interface SpotlightProps {
    variant: 'row' | 'overlay';
    video: Video;
    onExit: () => void;
    returnFocusId?: string;
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
        const privacyEnhancedUrl = normalizeYouTubeEmbedUrl(embedUrl);
        return `${privacyEnhancedUrl}${privacyEnhancedUrl.includes('?') ? '&' : '?'}${params.join('&')}`;
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
    ({ variant, video, onExit, returnFocusId }, ref) => {
        const isOverlay = variant === 'overlay';
        const dialogRef = useRef<HTMLDialogElement>(null);
        const closeButtonRef = useRef<HTMLButtonElement>(null);
        const previousFocusRef = useRef<HTMLElement | null>(null);
        const titleId = useId();

        useEffect(() => {
            if (!isOverlay) {
                return;
            }

            const dialog = dialogRef.current;
            const previousOverflow = document.body.style.overflow;
            previousFocusRef.current = document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
            document.body.style.overflow = 'hidden';

            if (dialog && !dialog.open) {
                if (typeof dialog.showModal === 'function') {
                    dialog.showModal();
                } else {
                    dialog.setAttribute('open', '');
                }
            }

            closeButtonRef.current?.focus();

            return () => {
                document.body.style.overflow = previousOverflow;
                if (dialog?.open) {
                    if (typeof dialog.close === 'function') {
                        dialog.close();
                    } else {
                        dialog.removeAttribute('open');
                    }
                }

                const previousFocus = previousFocusRef.current;
                window.requestAnimationFrame(() => {
                    const returnTarget = previousFocus?.isConnected
                        ? previousFocus
                        : returnFocusId
                            ? document.getElementById(returnFocusId)
                            : null;
                    returnTarget?.focus();
                });
            };
        }, [isOverlay, returnFocusId]);

        const content = (
            <div className="spotlight__content u-stack">
                <header className="spotlight__header">
                    <div className="spotlight__titles">
                        <p className="spotlight__eyebrow">{video.platform}</p>
                        <h2 className="spotlight__title" id={titleId}>
                            {video.title}
                        </h2>
                    </div>
                    <button
                        type="button"
                        className="btn btn--ghost"
                        onClick={onExit}
                        ref={isOverlay ? closeButtonRef : undefined}
                        autoFocus={isOverlay}
                    >
                        Exit Spotlight
                    </button>
                </header>
                <SpotlightPlayer embedUrl={video.embedUrl} title={video.title} url={video.url} />
                <div className="spotlight__meta">
                    <VideoCardMeta duration={video.duration} publishedAt={video.publishedAt} showTags={false} />
                </div>
            </div>
        );

        if (isOverlay) {
            return (
                <dialog
                    className="spotlight spotlight--overlay"
                    ref={dialogRef}
                    aria-labelledby={titleId}
                    onCancel={(event) => {
                        event.preventDefault();
                        onExit();
                    }}
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            onExit();
                        }
                    }}
                >
                    <div className="spotlight__panel spotlight__panel--overlay">
                        {content}
                    </div>
                </dialog>
            );
        }

        return (
            <div className="spotlight spotlight--row" ref={ref}>
                <div className="spotlight__panel">
                    {content}
                </div>
            </div>
        );
    }
);

Spotlight.displayName = 'Spotlight';
