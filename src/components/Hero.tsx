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
                    </h1>
                    <p className="hero__subtitle u-text-body">
                        Fast-moving cuts, late-night builds, and breakdowns from the games-in-progress feed.
                    </p>
                    <ul className="hero__badges" aria-label="Content types">
                        <li className="hero__badge">Clips</li>
                        <li className="hero__badge">Breakdowns</li>
                        <li className="hero__badge">Devlogs</li>
                    </ul>
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

                <div className="hero__social-proof" aria-label="Channel highlights">
                    <p className="u-text-caption">A small channel built as an escape from everyday life, hope you enjoy it.</p>
                </div>
            </div>
        </section>
    );
};

export const Hero = memo(HeroComponent);
Hero.displayName = 'Hero';
