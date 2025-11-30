import React, { useMemo, useState } from 'react';
import { posts } from '../content';
import { formatDate } from '../utils/format';

export const Blog: React.FC = () => {
    const [selectedTag, setSelectedTag] = useState<string>('All');

    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        posts.forEach((post) => {
            post.tags.forEach((tag) => tagSet.add(tag));
        });
        return ['All', ...Array.from(tagSet).sort()];
    }, []);

    const filteredPosts = useMemo(
        () => (selectedTag === 'All' ? posts : posts.filter((post) => post.tags.includes(selectedTag))),
        [selectedTag]
    );

    return (
        <div className="u-page u-stack-lg">
            <section className="c-panel c-panel--section u-stack">
                <header className="c-section-header c-section-header--accent">
                    <p className="c-section-header__label">Devlog</p>
                    <h2 className="c-section-header__title">All posts &amp; updates</h2>
                </header>

                <div className="tag-filter-row" aria-label="Filter posts by tag" role="group">
                    {allTags.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            className={`tag-filter ${selectedTag === tag ? 'tag-filter--active' : ''}`}
                            onClick={() => setSelectedTag(tag)}
                            aria-pressed={selectedTag === tag}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <ul className="post-list">
                    {filteredPosts.map((post) => (
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
