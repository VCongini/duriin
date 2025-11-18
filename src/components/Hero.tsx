import React, { memo } from 'react';
import { videos } from '../content';
import { formatDate } from '../utils/format';

const HeroComponent: React.FC = () => {
    const latestVideo = videos[0];

    return (
        <section className="hero" id="featured">
            <div className="hero__frame">
                <div className="hero__label">CHANNEL CORE</div>
                <h1 className="hero__title">
                    DURIIN
                    <span className="hero__title-accent">_ONLINE</span>
                </h1>
                <p className="hero__subtitle">
                    Sharp cuts, late-night sessions, and game-first breakdowns. A hub for the drops,
                    edits, and devlogs behind the screen.
                </p>

                {latestVideo && (
                    <div className="hero__now">
                        <div className="hero__now-label">NOW PLAYING</div>
                        <div className="hero__now-title">
                            {latestVideo.episode} — {latestVideo.title}
                        </div>
                        <div className="hero__now-meta">
                            <span className="chip chip--platform">{latestVideo.platform}</span>
                            <span className="chip chip--duration">{latestVideo.duration}</span>
                            <span className="chip chip--date">
                                {formatDate(latestVideo.publishedAt)}
                            </span>
                        </div>
                    </div>
                )}

                <div className="hero__cta-row">
                    <a
                        href={latestVideo?.url || 'https://www.youtube.com/@duriin'}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn--primary"
                    >
                        Watch latest drop
                    </a>
                    <a href="/videos" className="btn btn--ghost">
                        Browse videos
                    </a>
                </div>
            </div>
            <div className="hero__side">
                <div className="hero__stat hero__stat--primary">
                    <span className="hero__stat-label">MODE</span>
                    <span className="hero__stat-value">ONLINE</span>
                </div>
                <div className="hero__stat">
                    <span className="hero__stat-label">STATUS</span>
                    <span className="hero__stat-value">LIVE</span>
                </div>
                <div className="hero__stat">
                    <span className="hero__stat-label">FOCUS</span>
                    <span className="hero__stat-value">GAMING</span>
                </div>
            </div>
        </section>
    );
};

export const Hero = memo(HeroComponent);
Hero.displayName = 'Hero';
