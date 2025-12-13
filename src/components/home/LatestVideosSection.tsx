import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Video } from '../../content/types';
import { formatDate } from '../../utils/format';

export interface LatestVideosSectionProps {
    latestVideos: Video[];
    isLoading: boolean;
}

const NEW_THRESHOLD_DAYS = 10;

const PLATFORM_GLYPHS: Record<
    Video['platform'],
    { label: string; glyph: React.ReactNode; className: string }
> = {
    YouTube: {
        label: 'YouTube',
        className: 'episode__platform-glyph--youtube',
        glyph: (
            <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.92 4 12 4 12 4s-6.92 0-8.59.4a2.78 2.78 0 0 0-1.95 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 2C5.08 20 12 20 12 20s6.92 0 8.59-.4a2.78 2.78 0 0 0 1.95-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58ZM10 15.5v-7l6 3.5Z" />
            </svg>
        ),
    },
    Twitch: {
        label: 'Twitch',
        className: 'episode__platform-glyph--twitch',
        glyph: (
            <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
                <path d="M4 3 3 6v14h5v3l3-3h4l5-5V3Zm15 10-3 3h-4l-3 3v-3H5V5h14Z" />
                <path d="M13 7h2v5h-2zm-4 0h2v5H9z" />
            </svg>
        ),
    },
    TikTok: {
        label: 'TikTok',
        className: 'episode__platform-glyph--tiktok',
        glyph: (
            <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
                <path d="M19.7 7.4a6 6 0 0 1-3.7-1.3V15a5 5 0 1 1-5.7-4.9V12a2.5 2.5 0 1 0 1.5 2.3V3h2a3.5 3.5 0 0 0 3.5 3.5h1.4Z" />
            </svg>
        ),
    },
};

const isNewRelease = (publishedAt: string) => {
    const publishedDate = new Date(publishedAt);
    const today = new Date();

    if (Number.isNaN(publishedDate.getTime())) {
        return false;
    }

    const diffInMs = today.getTime() - publishedDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return diffInDays <= NEW_THRESHOLD_DAYS;
};

export const LatestVideosSection: React.FC<LatestVideosSectionProps> = ({ latestVideos, isLoading }) => {
    const decoratedVideos = useMemo(
        () =>
            latestVideos.map((video) => ({
                ...video,
                isNew: isNewRelease(video.publishedAt),
                platformMeta: PLATFORM_GLYPHS[video.platform],
            })),
        [latestVideos]
    );

    return (
        <section className="page-section u-stack">
            <header className="c-section-header c-section-header--accent c-section-header--with-cta">
                <div className="c-section-header__content">
                    <p className="c-section-header__label">Highlights</p>
                    <h2 className="c-section-header__title">Latest videos</h2>
                </div>
                <Link className="page-cta__secondary c-section-header__action" to="/videos">
                    See all videos
                </Link>
            </header>
            <ul className="episode-list">
                {isLoading ? (
                    <li className="episode episode--compact">Loading videos…</li>
                ) : (
                    decoratedVideos.map((video) => (
                        <li key={video.id} className="episode episode--compact">
                            <div className="episode__header">
                                <span className="episode__label">{video.episode}</span>
                                <div className="episode__header-actions">
                                    {video.isNew ? <span className="episode__badge">New</span> : null}
                                    <span className={`episode__status episode__status--${video.status.toLowerCase()}`}>
                                        {video.status}
                                    </span>
                                </div>
                            </div>
                            <div className="episode__title-row">
                                <div className="episode__title-stack">
                                    <a
                                        href={video.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="episode__title"
                                    >
                                        {video.title}
                                    </a>
                                </div>
                                <div className="episode__meta">
                                    <span className="tag tag--meta">{video.duration}</span>
                                    <span className="tag tag--platform">#{video.platform.toUpperCase()}</span>
                                    <span className="tag tag--meta">{formatDate(video.publishedAt)}</span>
                                </div>
                            </div>
                            <div className="episode__submeta">
                                <span
                                    className="episode__secondary-meta"
                                    aria-label={`${video.platform} destination`}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`episode__platform-glyph ${video.platformMeta.className}`}
                                    >
                                        {video.platformMeta.glyph}
                                    </span>
                                    <span>{video.platformMeta.label}</span>
                                </span>
                                <a
                                    className="episode__secondary-link"
                                    href={video.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Open in {video.platform}
                                </a>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </section>
    );
};
