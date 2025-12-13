import React from 'react';
import { Video } from '../../content/types';
import { formatDate } from '../../utils/format';

export interface LatestVideosSectionProps {
    latestVideos: Video[];
    isLoading: boolean;
}

export const LatestVideosSection: React.FC<LatestVideosSectionProps> = ({ latestVideos, isLoading }) => (
    <section className="page-section u-stack">
        <header className="c-section-header c-section-header--accent">
            <p className="c-section-header__label">Highlights</p>
            <h2 className="c-section-header__title">Latest videos</h2>
        </header>
        <ul className="episode-list">
            {isLoading ? (
                <li className="episode episode--compact">Loading videos…</li>
            ) : (
                latestVideos.map((video) => (
                    <li key={video.id} className="episode episode--compact">
                        <div className="episode__header">
                            <span className="episode__label">{video.episode}</span>
                            <span className={`episode__status episode__status--${video.status.toLowerCase()}`}>
                                {video.status}
                            </span>
                        </div>
                        <div className="episode__title-row">
                            <a
                                href={video.url}
                                target="_blank"
                                rel="noreferrer"
                                className="episode__title"
                            >
                                {video.title}
                            </a>
                            <div className="episode__meta">
                                <span className="tag tag--platform">#{video.platform.toUpperCase()}</span>
                                <span className="tag tag--meta">{video.duration}</span>
                                <span className="tag tag--meta">{formatDate(video.publishedAt)}</span>
                            </div>
                        </div>
                    </li>
                ))
            )}
        </ul>
    </section>
);
