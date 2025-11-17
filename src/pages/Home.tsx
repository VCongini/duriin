import React from 'react';
import { Hero } from '../components/Hero';
import { posts, videos } from '../content';
import { formatDate } from '../utils/format';

export const Home: React.FC = () => {
    const latestVideos = videos.slice(0, 3);
    const latestPosts = posts.slice(0, 2);

    return (
        <div className="page page--stack">
            <Hero />

            <section className="panel panel--primary">
                <div className="panel__label">Highlights</div>
                <h2 className="panel__title">Latest videos</h2>
                <ul className="episode-list">
                    {latestVideos.map((video) => (
                        <li key={video.id} className="episode episode--compact">
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
                                    <span className="chip chip--date">{formatDate(video.publishedAt)}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="panel panel--stacked">
                <div className="panel__label">Blog + Updates</div>
                <h2 className="panel__title">Latest posts</h2>
                <ul className="post-list">
                    {latestPosts.map((post) => (
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
