import React, {
    useCallback,
    useDeferredValue,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState
} from 'react';
import { VideoCard } from '../components/videos/VideoCard';
import { videos } from '../content';
import { Video } from '../content/types';
import { formatDate } from '../utils/format';
import { shouldShowStatus } from '../components/videos/VideoCard/videoCard.utils';

type SortOrder = 'newest' | 'oldest';

const sortVideos = (list: Video[], sort: SortOrder) =>
    [...list].sort((a, b) => {
        const diff = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        return sort === 'newest' ? -diff : diff;
    });

export const Videos: React.FC = () => {
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<SortOrder>('newest');
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [isTagMenuOpen, setTagMenuOpen] = useState(false);
    const [isSortMenuOpen, setSortMenuOpen] = useState(false);
    const [featuredId, setFeaturedId] = useState<string | null>(() => videos[0]?.id ?? null);

    const tags = useMemo(() => Array.from(new Set(videos.flatMap((v) => v.tags))).sort(), []);
    const deferredQuery = useDeferredValue(query);
    const tagFilterId = useId();
    const tagMenuRef = useRef<HTMLSpanElement>(null);
    const sortMenuRef = useRef<HTMLDivElement>(null);
    const sortMenuId = useId();

    const filtered = useMemo(() => {
        const normalizedQuery = deferredQuery.trim().toLowerCase();
        return sortVideos(videos, sort)
            .filter((video) => {
                const haystack = `${video.title} ${video.description ?? ''}`.toLowerCase();
                const matchQuery =
                    !normalizedQuery ||
                    haystack.includes(normalizedQuery) ||
                    video.tags.some((t) => t.toLowerCase().includes(normalizedQuery));
                const matchTag = activeTag ? video.tags.includes(activeTag) : true;
                return matchQuery && matchTag;
            })
            .map((video) => ({
                ...video,
                description: video.description ?? `Watch on ${video.platform}`
            }));
    }, [activeTag, deferredQuery, sort]);

    useEffect(() => {
        if (!filtered.length) {
            setFeaturedId(null);
            return;
        }
        setFeaturedId((current) => {
            if (current && filtered.some((video) => video.id === current)) {
                return current;
            }
            return filtered[0]?.id ?? null;
        });
    }, [filtered]);

    const featuredVideo = filtered.find((video) => video.id === featuredId) ?? filtered[0];
    const gridVideos = filtered;
    const nextVideo = gridVideos.find((video) => video.id !== featuredVideo?.id);

    const resultText =
        filtered.length === 1
            ? '1 video'
            : `${filtered.length} videos${activeTag ? ` tagged ${activeTag}` : ''}`;

    const tagOptions = useMemo(() => [{ value: null, label: 'All' }, ...tags.map((tag) => ({ value: tag, label: `#${tag}` }))], [tags]);

    const closeTagMenu = useCallback(() => {
        setTagMenuOpen(false);
    }, []);

    const handleTagSelect = useCallback(
        (value: string | null) => {
            setActiveTag(value);
            closeTagMenu();
        },
        [closeTagMenu]
    );

    const handleSortSelect = useCallback((value: SortOrder) => {
        setSort(value);
        setSortMenuOpen(false);
    }, []);

    const handleTagTriggerKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setTagMenuOpen(true);
        }
    }, []);

    const handleSortTriggerKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setSortMenuOpen(true);
        }
    }, []);

    const handleTagBlur = useCallback(
        (event: React.FocusEvent<HTMLElement>) => {
            if (tagMenuRef.current && !tagMenuRef.current.contains(event.relatedTarget as Node | null)) {
                closeTagMenu();
            }
        },
        [closeTagMenu]
    );

    const handleSortBlur = useCallback((event: React.FocusEvent<HTMLElement>) => {
        if (sortMenuRef.current && !sortMenuRef.current.contains(event.relatedTarget as Node | null)) {
            setSortMenuOpen(false);
        }
    }, []);

    const handleVideoSelect = useCallback((id: string) => {
        setFeaturedId(id);
    }, []);

    useEffect(() => {
        if (!isTagMenuOpen && !isSortMenuOpen) {
            return undefined;
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (tagMenuRef.current && !tagMenuRef.current.contains(event.target as Node)) {
                closeTagMenu();
            }

            if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
                setSortMenuOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeTagMenu();
                setSortMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [closeTagMenu, isSortMenuOpen, isTagMenuOpen]);

    return (
        <div className="u-page u-stack-lg videos-page">
            <section className="page-section u-stack">
                <header className="c-section-header c-section-header--accent">
                    <p className="c-section-header__label">Archive</p>
                    <h1 className="c-section-header__title">Videos</h1>
                </header>
                <p className="u-text-body u-readable">
                    Search every drop, filter by tag, and jump into the footage that matters most.
                </p>
                <div className="page-cta">
                    <a
                        href="https://www.youtube.com/@duriin6656"
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn--primary"
                    >
                        Watch on YouTube
                    </a>
                    <a href="/about" className="page-cta__secondary">
                        See what's coming next
                    </a>
                </div>
                <div className="page-card u-stack">
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
                            <div
                                className="filters__dropdown"
                                ref={sortMenuRef}
                                onBlur={handleSortBlur}
                                aria-label="Sort dropdown"
                            >
                                <button
                                    type="button"
                                    className="filters__select"
                                    aria-haspopup="listbox"
                                    aria-expanded={isSortMenuOpen}
                                    aria-controls={`${sortMenuId}-menu`}
                                    onClick={() => setSortMenuOpen((open) => !open)}
                                    onKeyDown={handleSortTriggerKeyDown}
                                >
                                    <span className="filters__select-label">
                                        {sort === 'newest' ? 'Newest first' : 'Oldest first'}
                                    </span>
                                    <span className="filters__select-icon" aria-hidden="true" />
                                </button>
                                {isSortMenuOpen && (
                                    <div
                                        id={`${sortMenuId}-menu`}
                                        role="listbox"
                                        aria-label="Sort options"
                                        className="filters__dropdown-menu"
                                    >
                                        <button
                                            type="button"
                                            role="option"
                                            aria-selected={sort === 'newest'}
                                            className={`filters__option ${sort === 'newest' ? 'is-active' : ''}`}
                                            onClick={() => handleSortSelect('newest')}
                                        >
                                            Newest first
                                        </button>
                                        <button
                                            type="button"
                                            role="option"
                                            aria-selected={sort === 'oldest'}
                                            className={`filters__option ${sort === 'oldest' ? 'is-active' : ''}`}
                                            onClick={() => handleSortSelect('oldest')}
                                        >
                                            Oldest first
                                        </button>
                                    </div>
                                )}
                            </div>
                        </label>
                        <label className="field field--tags" htmlFor={tagFilterId}>
                            <span className="field__label">Filter by tag</span>
                            {/* Tag filter: pills replaced by single dropdown for condensed UI (brutalist + modern themes supported) */}
                            <span
                                className="filters__dropdown"
                                ref={tagMenuRef}
                                onBlur={handleTagBlur}
                                aria-label="Tag filter dropdown"
                            >
                                <button
                                    id={tagFilterId}
                                    type="button"
                                    className="filters__select"
                                    aria-haspopup="listbox"
                                    aria-expanded={isTagMenuOpen}
                                    aria-controls={`${tagFilterId}-menu`}
                                    onClick={() => setTagMenuOpen((open) => !open)}
                                    onKeyDown={handleTagTriggerKeyDown}
                                >
                                    <span className="filters__select-label">{activeTag ? `#${activeTag}` : 'All'}</span>
                                    <span className="filters__select-icon" aria-hidden="true" />
                                </button>
                                {isTagMenuOpen && (
                                    <div
                                        id={`${tagFilterId}-menu`}
                                        role="listbox"
                                        aria-label="Tag options"
                                        className="filters__dropdown-menu"
                                    >
                                        {tagOptions.map(({ value, label }) => {
                                            const isActive = (!activeTag && value === null) || activeTag === value;
                                            return (
                                                <button
                                                    key={value ?? 'all'}
                                                    type="button"
                                                    role="option"
                                                    aria-selected={isActive}
                                                    className={`filters__option ${isActive ? 'is-active' : ''}`}
                                                    onClick={() => handleTagSelect(value)}
                                                >
                                                    {label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </span>
                        </label>
                    </form>
                    <div className="filter-summary" role="status" aria-live="polite">
                        {resultText}
                    </div>
                </div>

                {featuredVideo ? (
                    <article
                        key={featuredVideo.id}
                        className="video-spotlight"
                        role="region"
                        aria-live="polite"
                        aria-atomic="false"
                        aria-label="Selected video"
                    >
                        <div className="video-spotlight__media">
                            {featuredVideo.platform === 'YouTube' && featuredVideo.embedUrl ? (
                                <iframe
                                    src={`${featuredVideo.embedUrl}?rel=0`}
                                    title={featuredVideo.title}
                                    allowFullScreen
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    loading="lazy"
                                />
                            ) : featuredVideo.thumbnailUrl ? (
                                <img
                                    src={featuredVideo.thumbnailUrl}
                                    alt={featuredVideo.title}
                                    loading="lazy"
                                />
                            ) : (
                                <div className="video-spotlight__placeholder">{featuredVideo.platform}</div>
                            )}
                        </div>
                        <div className="video-spotlight__body u-stack">
                            <div className="episode__header">
                                <span className="episode__label">{featuredVideo.episode}</span>
                                {shouldShowStatus(featuredVideo.status) ? (
                                    <span
                                        className={`episode__status episode__status--${featuredVideo.status.toLowerCase()}`}
                                    >
                                        {featuredVideo.status}
                                    </span>
                                ) : null}
                            </div>
                            <h2 className="video-spotlight__title u-text-heading-lg">{featuredVideo.title}</h2>
                            <div className="episode__meta">
                                <span className="tag tag--platform">#{featuredVideo.platform.toUpperCase()}</span>
                                <span className="tag tag--meta">{featuredVideo.duration}</span>
                                <span className="tag tag--meta">
                                    {formatDate(featuredVideo.publishedAt, {
                                        month: 'short',
                                        day: '2-digit',
                                        year: 'numeric'
                                    })}
                                </span>
                                {featuredVideo.viewCount ? (
                                    <span className="tag tag--meta">
                                        {featuredVideo.viewCount.toLocaleString()} views
                                    </span>
                                ) : null}
                            </div>
                            <p className="video-spotlight__description u-text-body">{featuredVideo.description}</p>
                            <div className="episode__tags">
                                {featuredVideo.tags.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        className={`tag tag--content ${activeTag === tag ? 'tag--active' : ''}`}
                                        onClick={() => setActiveTag(tag)}
                                        aria-pressed={activeTag === tag}
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                            <div className="video-spotlight__actions page-cta">
                                <a
                                    href={featuredVideo.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn--primary"
                                >
                                    Watch on {featuredVideo.platform}
                                </a>
                                {nextVideo ? (
                                    <button
                                        type="button"
                                        className="btn btn--ghost"
                                        onClick={() => handleVideoSelect(nextVideo.id)}
                                    >
                                        Next in queue
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    </article>
                ) : (
                    <div className="video-empty" role="status">
                        No videos match that filter. Try clearing the search or switching tags.
                    </div>
                )}

                {gridVideos.length ? (
                    <div className="video-grid" role="list">
                        {gridVideos.map((video) => {
                            const isActive = video.id === featuredId;

                            return (
                                <VideoCard
                                    key={video.id}
                                    video={video}
                                    isActive={isActive}
                                    onSelect={handleVideoSelect}
                                />
                            );
                        })}
                    </div>
                ) : null}
            </section>
        </div>
    );
};
