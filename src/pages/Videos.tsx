import React, {
    useCallback,
    useDeferredValue,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState
} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { VideoCard } from '../components/videos/VideoCard';
import { Spotlight } from '../components/videos/Spotlight';
import { useViewedVideos } from '../components/videos/useViewedVideos';
import { getVideos } from '../content';
import { Video } from '../content/types';

type SortOrder = 'newest' | 'oldest';

const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        return window.matchMedia(query).matches;
    });

    useEffect(() => {
        if (typeof window === 'undefined') {
            return undefined;
        }

        const mediaQuery = window.matchMedia(query);
        const handleChange = (event: MediaQueryListEvent) => setMatches(event.matches);

        setMatches(mediaQuery.matches);
        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', handleChange);

            return () => mediaQuery.removeEventListener('change', handleChange);
        }

        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
    }, [query]);

    return matches;
};

const sortVideos = (list: Video[], sort: SortOrder) =>
    sort === 'newest'
        ? list
        : [...list].sort(
              (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
          );

export const Videos: React.FC = () => {
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<SortOrder>('newest');
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [isTagMenuOpen, setTagMenuOpen] = useState(false);
    const [isSortMenuOpen, setSortMenuOpen] = useState(false);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [spotlightId, setSpotlightId] = useState<string | null>(null);
    const [isSpotlightRendered, setIsSpotlightRendered] = useState(false);
    const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
    const [renderedSpotlight, setRenderedSpotlight] = useState<Video | null>(null);
    const [spotlightHeight, setSpotlightHeight] = useState(0);
    const [videos, setVideos] = useState<Video[] | null>(null);
    const [isLoadingVideos, setIsLoadingVideos] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const isCompactMode = true;
    const { isViewed, markViewed } = useViewedVideos();

    const tags = useMemo(
        () => Array.from(new Set((videos ?? []).flatMap((v) => v.tags))).sort(),
        [videos]
    );
    const deferredQuery = useDeferredValue(query);
    const tagFilterId = useId();
    const tagMenuRef = useRef<HTMLSpanElement>(null);
    const sortMenuRef = useRef<HTMLDivElement>(null);
    const sortMenuId = useId();
    const spotlightRowRef = useRef<HTMLDivElement>(null);
    const spotlightContentRef = useRef<HTMLDivElement>(null);
    const spotlightAppliedRef = useRef<string | null>(null);
    const location = useLocation();
    const isMobile = useMediaQuery('(max-width: 47.99rem)');
    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

    const filtered = useMemo(() => {
        if (!videos) {
            return [];
        }

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
    }, [activeTag, deferredQuery, sort, videos]);

    const isPlayingInFilter = playingId ? filtered.some((video) => video.id === playingId) : false;
    const activePlayerId = isPlayingInFilter ? playingId : null;
    const spotlightVideo = spotlightId ? filtered.find((video) => video.id === spotlightId) : null;
    const spotlightedVideoId = spotlightVideo?.id ?? renderedSpotlight?.id ?? null;
    const listWithoutSpotlight = spotlightedVideoId
        ? filtered.filter((video) => video.id !== spotlightedVideoId)
        : filtered;

    useEffect(() => {
        if (!playingId) {
            return;
        }

        if (!filtered.some((video) => video.id === playingId)) {
            setPlayingId(null);
        }
    }, [filtered, playingId]);

    useEffect(() => {
        if (spotlightId && !spotlightVideo) {
            setSpotlightId(null);
            setPlayingId((current) => (current === spotlightId ? null : current));
        }
    }, [spotlightId, spotlightVideo]);

    const spotlightParam = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return params.get('spotlight');
    }, [location.search]);

    useEffect(() => {
        if (!spotlightParam || !videos) {
            return;
        }

        if (spotlightAppliedRef.current === spotlightParam) {
            return;
        }

        if (videos.some((video) => video.id === spotlightParam)) {
            setSpotlightId(spotlightParam);
            setPlayingId(spotlightParam);
            spotlightAppliedRef.current = spotlightParam;
        }
    }, [spotlightParam, videos]);

    useEffect(() => {
        let frame: number | null = null;

        if (isMobile) {
            setRenderedSpotlight(spotlightVideo ?? null);
            setIsSpotlightRendered(Boolean(spotlightVideo));
            setIsSpotlightOpen(Boolean(spotlightVideo));
            return () => {};
        }

        if (spotlightVideo) {
            setRenderedSpotlight(spotlightVideo);
            setIsSpotlightRendered(true);
            frame = window.requestAnimationFrame(() => {
                setIsSpotlightOpen(true);
            });
        } else if (renderedSpotlight) {
            setIsSpotlightOpen(false);
        } else {
            setIsSpotlightRendered(false);
        }

        return () => {
            if (frame) {
                window.cancelAnimationFrame(frame);
            }
        };
    }, [isMobile, renderedSpotlight, spotlightVideo]);

    useEffect(() => {
        if (!isSpotlightRendered || isMobile) {
            return;
        }

        const contentEl = spotlightContentRef.current;
        if (!contentEl) {
            return;
        }

        const measure = () => {
            const rect = contentEl.getBoundingClientRect();
            const styles = getComputedStyle(contentEl);
            const marginBottom = parseFloat(styles.marginBottom) || 0;
            setSpotlightHeight(rect.height + marginBottom);
        };

        measure();

        if (typeof ResizeObserver === 'undefined') {
            return;
        }

        const resizeObserver = new ResizeObserver(() => measure());
        resizeObserver.observe(contentEl);

        return () => {
            resizeObserver.disconnect();
        };
    }, [isMobile, isSpotlightRendered, renderedSpotlight]);

    useEffect(() => {
        if (
            !isMobile &&
            prefersReducedMotion &&
            !isSpotlightOpen &&
            isSpotlightRendered &&
            !spotlightVideo
        ) {
            setIsSpotlightRendered(false);
            setRenderedSpotlight(null);
            setSpotlightHeight(0);
        }
    }, [isMobile, isSpotlightOpen, isSpotlightRendered, prefersReducedMotion, spotlightVideo]);

    useEffect(() => {
        let isMounted = true;
        setIsLoadingVideos(true);
        setLoadError(null);

        getVideos()
            .then((loadedVideos) => {
                if (!isMounted) {
                    return;
                }

                setVideos(loadedVideos);
            })
            .catch((error) => {
                console.error('Unable to load videos', error);
                if (!isMounted) {
                    return;
                }

                setLoadError('Unable to load videos right now.');
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

    const resultText = loadError
        ? loadError
        : isLoadingVideos
            ? 'Loading videos…'
            : filtered.length === 1
                ? '1 video'
                : `${filtered.length} videos${activeTag ? ` tagged ${activeTag}` : ''}`;

    const tagOptions = useMemo(
        () => [{ value: null, label: 'All' }, ...tags.map((tag) => ({ value: tag, label: `#${tag}` }))],
        [tags]
    );

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

    const handleVideoPlay = useCallback(
        (id: string) => {
            setPlayingId((current) => {
                const next = current === id ? null : id;

                if (next === id) {
                    markViewed(id);
                }

                return next;
            });
        },
        [markViewed]
    );

    const handleSpotlightToggle = useCallback((id: string) => {
        setSpotlightId((current) => {
            const next = current === id ? null : id;
            setPlayingId(next ? id : null);
            return next;
        });
    }, []);

    const handleSpotlightExit = useCallback(() => {
        setSpotlightId(null);
        setPlayingId(null);
    }, []);

    const handleSpotlightTransitionEnd = useCallback(
        (event: React.TransitionEvent<HTMLDivElement>) => {
            if (event.propertyName !== 'height') {
                return;
            }

            if (!isSpotlightOpen) {
                setIsSpotlightRendered(false);
                setRenderedSpotlight(null);
                setSpotlightHeight(0);
            }
        },
        [isSpotlightOpen]
    );

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

    useEffect(() => {
        if (!spotlightId) {
            return;
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleSpotlightExit();
            }
        };

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [handleSpotlightExit, spotlightId]);

    useEffect(() => {
        if (spotlightVideo && !isMobile && spotlightRowRef.current) {
            spotlightRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [isMobile, spotlightVideo]);

    return (
        <div className={`u-page u-stack-lg videos-page ${isCompactMode ? 'videos-page--compact' : ''}`}>
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
                    <Link to="/about" className="page-cta__secondary">
                        See what's coming next
                    </Link>
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

                {loadError ? (
                    <div className="video-empty" role="status">
                        {loadError}
                    </div>
                ) : isLoadingVideos ? (
                    <div className="video-empty" role="status">
                        Loading videos…
                    </div>
                ) : filtered.length ? (
                    <>
                        {isMobile ? (
                            spotlightVideo ? (
                                <Spotlight variant="overlay" video={spotlightVideo} onExit={handleSpotlightExit} />
                            ) : null
                        ) : isSpotlightRendered ? (
                            <div
                                className={`spotlight-shell ${isSpotlightOpen ? 'spotlight-shell--open' : ''}`}
                                style={{
                                    height: isSpotlightOpen ? `${Math.max(spotlightHeight, 0)}px` : '0px'
                                }}
                                onTransitionEnd={handleSpotlightTransitionEnd}
                            >
                                <div ref={spotlightContentRef} className="spotlight-shell__inner">
                                    {renderedSpotlight ? (
                                        <Spotlight
                                            variant="row"
                                            video={renderedSpotlight}
                                            onExit={handleSpotlightExit}
                                            ref={spotlightRowRef}
                                        />
                                    ) : null}
                                </div>
                            </div>
                        ) : null}
                        <div className="video-grid" role="list">
                            {listWithoutSpotlight.map((video) => (
                                <VideoCard
                                    key={video.id}
                                    video={video}
                                    isViewed={isViewed(video.id)}
                                    isPlaying={activePlayerId === video.id}
                                    onPlay={handleVideoPlay}
                                    isCompact={isCompactMode}
                                    isSpotlighted={video.id === spotlightId}
                                    onSpotlightToggle={handleSpotlightToggle}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="video-empty" role="status">
                        No videos match that filter. Try clearing the search or switching tags.
                    </div>
                )}
            </section>
        </div>
    );
};
