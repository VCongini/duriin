import React from 'react';

const socials = [
    { name: 'YouTube', url: 'https://www.youtube.com/@duriin' },
    { name: 'Twitch', url: 'https://www.twitch.tv' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@duriin' },
    { name: 'Twitter / X', url: 'https://twitter.com' },
    { name: 'Instagram', url: 'https://www.instagram.com' },
    { name: 'Reddit', url: 'https://www.reddit.com' }
];

export const About: React.FC = () => {
    return (
        <div className="u-page u-stack-lg">
            <section className="c-panel c-panel--primary u-stack">
                <p className="c-panel__label u-text-caption">About</p>
                <h1 className="c-panel__title u-text-heading-xl">What is Duriin?</h1>
                <div className="u-readable u-stack">
                    <p className="c-panel__body u-text-body">
                        Duriin is a channel for people who like their feeds sharp and their games loud.
                        Expect breakdowns of FPS setups, behind-the-scenes edits, and experiments in
                        game audio and visuals. No fluff—just the drop.
                    </p>
                    <p className="c-panel__body u-text-body">
                        This space will expand with player guides, patch note reactions, build logs,
                        and cross-posted shorts. If you want something featured, ping me and I will
                        line it up in the queue.
                    </p>
                </div>
                <div className="page-cta">
                    <a
                        href="https://www.youtube.com/@duriin"
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

            <section className="c-panel u-stack">
                <p className="c-panel__label u-text-caption">Platforms</p>
                <h2 className="c-panel__title u-text-heading-lg">Find me elsewhere</h2>
                <ul className="link-list u-readable u-text-body">
                    {socials.map((link) => (
                        <li key={link.name}>
                            <a href={link.url} target="_blank" rel="noreferrer">
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="c-panel u-stack">
                <p className="c-panel__label u-text-caption">Roadmap</p>
                <h2 className="c-panel__title u-text-heading-lg">Coming soon</h2>
                <ul className="bullet-list u-readable u-text-body">
                    <li>Full gaming setup tour with settings you can copy.</li>
                    <li>Cutdowns of streams into actionable highlights.</li>
                    <li>Weekly focus threads on Reddit and Discord when live.</li>
                </ul>
            </section>
        </div>
    );
};
