import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { featuredTopics, getVideos, posts } from '../content';
import { Video } from '../content/types';
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
    const [latestVideos, setLatestVideos] = useState<Video[]>([]);
    const [isLoadingVideos, setIsLoadingVideos] = useState(true);
    const latestPosts = useMemo(() => posts.slice(0, 2), []);

    useEffect(() => {
        let isMounted = true;
        setIsLoadingVideos(true);

        getVideos()
            .then((videos) => {
                if (isMounted) {
                    setLatestVideos(videos.slice(0, 3));
                }
            })
            .catch((error) => {
                console.error('Unable to load videos', error);
                if (isMounted) {
                    setLatestVideos([]);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoadingVideos(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="u-page u-stack-lg">
            <Hero />
            <Suspense fallback={<CarouselFallback />}>
                <FeaturedCarousel items={featuredTopics} />
            </Suspense>

            <section className="page-section u-stack">
                <header className="c-section-header c-section-header--accent">
                    <p className="c-section-header__label">Highlights</p>
                    <h2 className="c-section-header__title">Latest videos</h2>
                </header>
                <ul className="episode-list">
                    {isLoadingVideos ? (
                        <li className="episode episode--compact">Loading videos…</li>
                    ) : (
                        latestVideos.map((video) => (
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
                                        <span className="tag tag--platform">#{video.platform.toUpperCase()}</span>
                                        <span className="tag tag--meta">{video.duration}</span>
                                        <span className="tag tag--meta">{formatDate(video.publishedAt)}</span>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </section>

            <section className="page-section u-stack">
                <header className="c-section-header c-section-header--accent">
                    <p className="c-section-header__label">Blog + Updates</p>
                    <h2 className="c-section-header__title">Latest posts</h2>
                </header>
                <div className="page-cta">
                    <Link className="page-cta__secondary" to="/blog">
                        View all posts
                    </Link>
                </div>
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
                                    <span key={tag} className="tag tag--content">
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
