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
        <div className="page page--stack">
            <section className="panel panel--primary">
                <div className="panel__label">About</div>
                <h1 className="panel__title">What is Duriin?</h1>
                <p className="panel__body">
                    Duriin is a channel for people who like their feeds sharp and their games loud.
                    Expect breakdowns of FPS setups, behind-the-scenes edits, and experiments in
                    game audio and visuals. No fluff—just the drop.
                </p>
                <p className="panel__body">
                    This space will expand with player guides, patch note reactions, build logs, and
                    cross-posted shorts. If you want something featured, ping me and I will line it
                    up in the queue.
                </p>
            </section>

            <section className="panel panel--stacked">
                <div className="panel__label">Platforms</div>
                <h2 className="panel__title">Find me elsewhere</h2>
                <ul className="link-list">
                    {socials.map((link) => (
                        <li key={link.name}>
                            <a href={link.url} target="_blank" rel="noreferrer">
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="panel panel--stacked">
                <div className="panel__label">Roadmap</div>
                <h2 className="panel__title">Coming soon</h2>
                <ul className="bullet-list">
                    <li>Full gaming setup tour with settings you can copy.</li>
                    <li>Cutdowns of streams into actionable highlights.</li>
                    <li>Weekly focus threads on Reddit and Discord when live.</li>
                </ul>
            </section>
        </div>
    );
};
