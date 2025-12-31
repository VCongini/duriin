import React from 'react';

const socials = [
    { name: 'YouTube', url: 'https://www.youtube.com/@duriin6656' },
    { name: 'Twitch', url: 'https://www.twitch.tv/duriindoes' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@duriin2' },
    { name: 'Twitter / X', url: 'https://x.com/Duriin2' }
];

export const About: React.FC = () => {
    return (
        <div className="u-page u-stack-lg">
            <section className="page-section u-stack">
                <header className="c-section-header c-section-header--accent">
                    <p className="c-section-header__label">About</p>
                    <h1 className="c-section-header__title">What is Duriin?</h1>
                </header>
                <div className="u-readable u-stack">
                    <p className="u-text-body">
                        I'm Duriin, a gamer who likes to tinker and occasionally code. This is the
                        accumulation of fun moments that deserve a home.
                    </p>
                    <p className="u-text-body">
                        You will find clips, quick breakdowns, and small experiments when they are
                        worth sharing. If something resonates, reach out.
                    </p>
                </div>
                <div className="page-cta">
                    <a
                        href="https://www.youtube.com/@duriin6656"
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn--primary"
                    >
                        Watch the channel
                    </a>
                    <a href="/videos" className="page-cta__secondary">
                        Browse the video archive
                    </a>
                </div>
            </section>

            <section className="page-section u-stack">
                <header className="c-section-header c-section-header--accent">
                    <p className="c-section-header__label">Community</p>
                    <h2 className="c-section-header__title">Across the network</h2>
                </header>
                <div className="page-card-grid">
                    <article className="page-card u-stack">
                        <p className="c-section-header__label">Platforms</p>
                        <h3 className="u-text-heading-lg">Find me elsewhere</h3>
                        <ul className="link-list u-readable u-text-body">
                            {socials.map((link) => (
                                <li key={link.name}>
                                    <a href={link.url} target="_blank" rel="noreferrer">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="page-card u-stack">
                        <p className="c-section-header__label">Roadmap</p>
                        <h3 className="u-text-heading-lg">Coming soon</h3>
                        <ul className="bullet-list u-readable u-text-body">
                            <li>Full gaming setup tour with settings you can copy.</li>
                            <li>Cutdowns of streams into actionable highlights.</li>
                            <li>Weekly focus threads on Reddit and Discord when live.</li>
                        </ul>
                    </article>
                </div>
            </section>
        </div>
    );
};
