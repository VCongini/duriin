import React, { Suspense, lazy, useMemo } from 'react';
import { Hero } from '../components/Hero';
import { featuredTopics, posts, videos } from '../content';
import { formatDate } from '../utils/format';

const FeaturedCarousel = lazy(() =>
    import('../components/FeaturedCarousel').then((module) => ({ default: module.FeaturedCarousel }))
);

const CarouselFallback: React.FC = () => (
    <section className="c-panel c-panel--loading u-stack" aria-live="polite" aria-busy="true">
        <div className="skeleton-block" style={{ width: '35%' }} />
        <div className="skeleton-block" style={{ width: '65%', height: '2.5rem' }} />
        <div className="skeleton-block" style={{ height: '10rem' }} />
    </section>
);

export const Home: React.FC = () => {
    const latestVideos = useMemo(() => videos.slice(0, 3), []);
    const latestPosts = useMemo(() => posts.slice(0, 2), []);

    return (
        <div className="u-page u-stack-lg">
            <Hero />
            <Suspense fallback={<CarouselFallback />}>
                <FeaturedCarousel items={featuredTopics} />
            </Suspense>

            <section className="c-panel c-panel--primary c-panel--section u-stack">
                <header className="c-section-header">
                    <p className="c-section-header__label">Highlights</p>
                    <h2 className="c-section-header__title">Latest videos</h2>
                </header>
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

            <section className="c-panel c-panel--section u-stack">
                <header className="c-section-header">
                    <p className="c-section-header__label">Blog + Updates</p>
                    <h2 className="c-section-header__title">Latest posts</h2>
                </header>
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
