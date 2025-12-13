import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../content/types';
import { formatDate } from '../../utils/format';

export interface LatestPostsSectionProps {
    latestPosts: Post[];
}

export const LatestPostsSection: React.FC<LatestPostsSectionProps> = ({ latestPosts }) => (
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
);
