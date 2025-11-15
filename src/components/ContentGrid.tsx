import React from 'react';

const mockVideos = [
    {
        id: 1,
        label: 'EPISODE 01',
        title: 'Synthetic Dawn // Intro Sequence',
        duration: '08:43',
        status: 'LIVE'
    },
    {
        id: 2,
        label: 'EPISODE 02',
        title: 'Brutalist UI // Layout Breakdown',
        duration: '14:27',
        status: 'ARCHIVED'
    },
    {
        id: 3,
        label: 'EPISODE 03',
        title: 'Latency Wars // FPS Tuning',
        duration: '19:09',
        status: 'LIVE'
    }
];

export const ContentGrid: React.FC = () => {
    return (
        <section className="grid" id="videos">
            <div className="grid__col grid__col--wide">
                <div className="panel panel--primary">
                    <div className="panel__label">TRANSMISSION LOG</div>
                    <h2 className="panel__title">Featured Episodes</h2>
                    <ul className="episode-list">
                        {mockVideos.map((video) => (
                            <li key={video.id} className="episode">
                                <div className="episode__header">
                                    <span className="episode__label">{video.label}</span>
                                    <span className="episode__status">{video.status}</span>
                                </div>
                                <div className="episode__title-row">
                                    <span className="episode__title">{video.title}</span>
                                    <span className="episode__duration">{video.duration}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="grid__col" id="about">
                <div className="panel">
                    <div className="panel__label">ABOUT</div>
                    <h2 className="panel__title">What is Duriin?</h2>
                    <p className="panel__body">
                        Duriin is a signal for people who like their visuals heavy, their sound
                        dark, and their interfaces sharp. No rounded corners, no soft fades —
                        just clean geometry and deliberate motion.
                    </p>
                    <p className="panel__body">
                        Expect breakdowns of game settings, FPS tuning, synth‑driven edits, and the
                        occasional deep dive into how this whole thing is wired together.
                    </p>
                </div>
                <div className="panel panel--stacked">
                    <div className="panel__label">LINKS</div>
                    <ul className="link-list">
                        <li>
                            <a href="https://youtube.com" target="_blank" rel="noreferrer">
                                YouTube Channel
                            </a>
                        </li>
                        <li>
                            <a href="https://twitch.tv" target="_blank" rel="noreferrer">
                                Twitch Stream
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com" target="_blank" rel="noreferrer">
                                GitHub Projects
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
};
