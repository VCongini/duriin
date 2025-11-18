import React, { useDeferredValue, useMemo, useState } from 'react';
import { videos } from '../content';
import { formatDate } from '../utils/format';

type SortOrder = 'newest' | 'oldest';

export const Videos: React.FC = () => {
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<SortOrder>('newest');
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const tags = useMemo(() => Array.from(new Set(videos.flatMap((v) => v.tags))).sort(), []);
    const deferredQuery = useDeferredValue(query);

    const filtered = useMemo(() => {
        return [...videos]
            .filter((video) => {
                const matchQuery =
                    video.title.toLowerCase().includes(deferredQuery.toLowerCase()) ||
                    video.tags.some((t) => t.toLowerCase().includes(deferredQuery.toLowerCase()));
                const matchTag = activeTag ? video.tags.includes(activeTag) : true;
                return matchQuery && matchTag;
            })
            .sort((a, b) => {
                const diff =
                    new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
                return sort === 'newest' ? -diff : diff;
            });
    }, [activeTag, deferredQuery, sort]);

    const resultText =
        filtered.length === 1
            ? '1 video'
            : `${filtered.length} videos${activeTag ? ` tagged ${activeTag}` : ''}`;

    return (
        <div className="page page--stack">
            <section className="panel panel--primary">
                <div className="panel__label">Archive</div>
                <h1 className="panel__title">Videos</h1>
                <form className="filters" aria-label="Video filters" onSubmit={(e) => e.preventDefault()}>
                    <label className="field">
                        <span className="field__label">Search</span>
                        <input
                            type="search"
                            placeholder="Title or keyword"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </label>
                    <label className="field">
                        <span className="field__label">Sort</span>
                        <select value={sort} onChange={(e) => setSort(e.target.value as SortOrder)}>
                            <option value="newest">Newest first</option>
                            <option value="oldest">Oldest first</option>
                        </select>
                    </label>
                    <div className="field field--tags">
                        <span className="field__label">Tags</span>
                        <div className="tag-grid" role="list">
                            <button
                                type="button"
                                className={`tag ${activeTag === null ? 'tag--active' : ''}`}
                                onClick={() => setActiveTag(null)}
                                aria-pressed={activeTag === null}
                            >
                                All
                            </button>
                            {tags.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    className={`tag ${activeTag === tag ? 'tag--active' : ''}`}
                                    onClick={() => setActiveTag(tag)}
                                    aria-pressed={activeTag === tag}
                                >
                                    #{tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </form>
                <div className="filter-summary" role="status" aria-live="polite">
                    {resultText}
                </div>

                <ul className="episode-list">
                    {filtered.map((video) => (
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
                                        {formatDate(video.publishedAt, {
                                            month: 'short',
                                            day: '2-digit',
                                            year: 'numeric'
                                        })}
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
        </div>
    );
};
