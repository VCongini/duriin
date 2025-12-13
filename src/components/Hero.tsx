import React, { memo, useEffect, useState } from 'react';
import { getVideos } from '../content';
import { Video } from '../content/types';

const HeroComponent: React.FC = () => {
    const [latestVideo, setLatestVideo] = useState<Video | null>(null);

    useEffect(() => {
        let isMounted = true;

        getVideos()
            .then((videos) => {
                if (isMounted) {
                    setLatestVideo(videos[0] ?? null);
                }
            })
            .catch((error) => {
                console.error('Unable to load videos', error);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="hero" id="featured">
            <div className="hero__frame c-panel c-panel--primary u-stack">
                <p className="c-panel__label u-text-caption">CHANNEL CORE</p>
                <div className="hero__content u-readable u-stack">
                    <h1 className="hero__title u-text-heading-xl">
                        DURIIN
                        <span className="hero__title-accent">_ONLINE</span>
                    </h1>
                    <p className="hero__subtitle u-text-body">
                        Sharp cuts, late-night sessions, and game-first breakdowns. A hub for the
                        drops, edits, and devlogs behind the screen.
                    </p>
                </div>

                <div className="hero__cta-row page-cta">
                    <a
                        href={latestVideo?.url || 'https://www.youtube.com/@duriin6656'}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn--primary"
                    >
                        Watch latest drop
                    </a>
                    <a href="/videos" className="page-cta__secondary hero__secondary-link">
                        Browse the archive
                    </a>
                </div>
            </div>
        </section>
    );
};

export const Hero = memo(HeroComponent);
Hero.displayName = 'Hero';
