import React from 'react';
import { posts, videos } from '../content';

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

export const Featured: React.FC = () => {
    const priority = videos.filter((v) => v.status === 'LIVE' || v.status === 'PREMIERE');
    const backups = videos.slice(0, 3);
    const headliners = (priority.length ? priority : backups).slice(0, 3);
    const signalBoost = posts.slice(0, 3);

    return (
        <div className="page page--stack">
            <section className="panel panel--primary">
                <div className="panel__label">Priority Feed</div>
                <h1 className="panel__title">Featured Signals</h1>
                <ul className="episode-list">
                    {headliners.map((video) => (
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
                                    <span className="chip chip--platform">{video.platform}</span>
                                    <span className="chip chip--duration">{video.duration}</span>
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
            </section>

            <section className="panel panel--stacked">
                <div className="panel__label">Spotlight</div>
                <h2 className="panel__title">Posts worth your time</h2>
                <ul className="post-list">
                    {signalBoost.map((post) => (
                        <li key={post.id} className="post">
                            <div className="post__row">
                                <a href={post.url} className="post__title" target="_blank" rel="noreferrer">
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
            </section>
        </div>
    );
};
