import React, { memo } from 'react';
import { videos } from '../content';

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
        </section>
    );
};

export const Hero = memo(HeroComponent);
Hero.displayName = 'Hero';
