import React from 'react';
import { posts, videos } from '../content';

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

export const ContentGrid: React.FC = () => {
    const featuredVideos = videos.slice(0, 4);
    const latestPosts = posts.slice(0, 3);

    return (
        <section className="grid" id="videos">
            <div className="grid__col grid__col--wide">
                <div className="panel panel--primary">
                    <div className="panel__label">TRANSMISSION LOG</div>
                    <h2 className="panel__title">Featured Episodes</h2>
                    <ul className="episode-list">
                        {featuredVideos.map((video) => (
                            <li key={video.id} className="episode">
                                <div className="episode__header">
                                    <span className="episode__label">{video.episode}</span>
                                    <span
                                        className={`episode__status episode__status--${video.status.toLowerCase()}`}
                                    >
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
                                        <span className="chip chip--platform">
                                            {video.platform}
                                        </span>
                                        <span className="chip chip--duration">
                                            {video.duration}
                                        </span>
                                        <span className="chip chip--date">
                                            {formatDate(video.publishedAt)}
                                        </span>
                                    </div>
                                </div>
                                <div className="episode__tags">
                                    {video.tags.map((tag) => (
                                        <span key={tag} className="tag">
                                            #{tag}
                                        </span>
                                    ))}
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
                        Expect breakdowns of game settings, FPS tuning, synth-driven edits, and the
                        occasional deep dive into how this whole thing is wired together.
                    </p>
                </div>
                <div className="panel panel--stacked">
                    <div className="panel__label">BLOG + UPDATES</div>
                    <h2 className="panel__title">Latest Posts</h2>
                    <ul className="post-list">
                        {latestPosts.map((post) => (
                            <li key={post.id} className="post">
                                <div className="post__row">
                                    <a
                                        href={post.url}
                                        className="post__title"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {post.title}
                                    </a>
                                    <span className="post__date">{formatDate(post.publishedAt)}</span>
                                </div>
                                <p className="post__excerpt">{post.excerpt}</p>
                                <div className="post__tags">
                                    {post.tags.map((tag) => (
                                        <span key={tag} className="tag">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="panel panel--stacked">
                    <div className="panel__label">LINKS</div>
                    <ul className="link-list">
                        <li>
                            <a href="https://www.youtube.com/@duriin" target="_blank" rel="noreferrer">
                                YouTube Channel
                            </a>
                        </li>
                        <li>
                            <a href="https://www.tiktok.com/@duriin" target="_blank" rel="noreferrer">
                                TikTok Feed
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/vcongini" target="_blank" rel="noreferrer">
                                GitHub Projects
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
};
