import React from 'react';

export const Hero: React.FC = () => {
    return (
        <section className="hero" id="featured">
            <div className="hero__frame">
                <div className="hero__label">CHANNEL CORE</div>
                <h1 className="hero__title">
                    DURIIN
                    <span className="hero__title-accent">_ONLINE</span>
                </h1>
                <p className="hero__subtitle">
                    Heavy, deliberate, and unapologetically sharp. A home for dark synth,
                    brutalist experiments, and late‑night code runs.
                </p>
                <div className="hero__cta-row">
                    <a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn--primary"
                    >
                        WATCH LATEST TRANSMISSION
                    </a>
                    <a href="#videos" className="btn btn--ghost">
                        SCAN ARCHIVE
                    </a>
                </div>
            </div>
            <div className="hero__side">
                <div className="hero__stat hero__stat--primary">
                    <span className="hero__stat-label">MODE</span>
                    <span className="hero__stat-value">BRUTALIST</span>
                </div>
                <div className="hero__stat">
                    <span className="hero__stat-label">STATUS</span>
                    <span className="hero__stat-value">SIGNAL LIVE</span>
                </div>
                <div className="hero__stat">
                    <span className="hero__stat-label">LATENCY</span>
                    <span className="hero__stat-value">&lt; 16ms</span>
                </div>
            </div>
        </section>
    );
};
