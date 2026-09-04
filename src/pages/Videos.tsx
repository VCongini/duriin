import React, {
    useCallback,
    useDeferredValue,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { VideoCard } from '../components/videos/VideoCard';
import { Spotlight } from '../components/videos/Spotlight';
import { useViewedVideos } from '../components/videos/useViewedVideos';
import { getTagOptions, videoHasTag } from '../components/videos/videoFilters';
import { getVideos } from '../content';
import { Video } from '../content/types';
import { parseDate } from '../utils/format';

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

const sortVideos = (list: Video[], sort: SortOrder) => {
    const direction = sort === 'newest' ? -1 : 1;

    return [...list].sort(
        (a, b) => direction * (parseDate(a.publishedAt).getTime() - parseDate(b.publishedAt).getTime())
    );
};

export const Videos: React.FC = () => {
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<SortOrder>('newest');
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [spotlightId, setSpotlightId] = useState<string | null>(null);
    const [isSpotlightRendered, setIsSpotlightRendered] = useState(false);
    const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
    const [renderedSpotlight, setRenderedSpotlight] = useState<Video | null>(null);
    const [spotlightHeight, setSpotlightHeight] = useState(0);
    const [videos, setVideos] = useState<Video[] | null>(null);
    const [isLoadingVideos, setIsLoadingVideos] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const { isViewed, markViewed } = useViewedVideos();

    const tags = useMemo(() => getTagOptions(videos ?? []), [videos]);
    const deferredQuery = useDeferredValue(query);
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
                const matchTag = activeTag ? videoHasTag(video, activeTag) : true;
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
    const activeTagLabel = activeTag
        ? tags.find((tag) => tag.value === activeTag)?.label ?? activeTag
        : null;

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
                : `${filtered.length} videos${activeTagLabel ? ` tagged ${activeTagLabel}` : ''}`;

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
                        <label className="field" htmlFor="video-sort">
                            <span className="field__label">Sort</span>
                            <span className="filters__dropdown">
                                <select
                                    id="video-sort"
                                    className="filters__select"
                                    value={sort}
                                    onChange={(event) => setSort(event.target.value as SortOrder)}
                                >
                                    <option value="newest">Newest first</option>
                                    <option value="oldest">Oldest first</option>
                                </select>
                                <span className="filters__select-icon" aria-hidden="true" />
                            </span>
                        </label>
                        <label className="field field--tags" htmlFor="video-tag-filter">
                            <span className="field__label">Filter by tag</span>
                            <span className="filters__dropdown">
                                <select
                                    id="video-tag-filter"
                                    className="filters__select"
                                    value={activeTag ?? ''}
                                    onChange={(event) => setActiveTag(event.target.value || null)}
                                >
                                    <option value="">All</option>
                                    {tags.map((tag) => (
                                        <option key={tag.value} value={tag.value}>
                                            #{tag.label}
                                        </option>
                                    ))}
                                </select>
                                <span className="filters__select-icon" aria-hidden="true" />
                            </span>
                        </label>
                    </form>
                    <div className="filter-summary" role="status" aria-live="polite">
                        {resultText}
                    </div>
                </div>

                <div className="video-results">
                    {loadError ? (
                        <div className="video-empty" role="status">
                            {loadError}
                        </div>
                    ) : isLoadingVideos ? (
                        <div className="video-grid video-grid--loading" aria-hidden="true">
                            {[0, 1, 2].map((index) => (
                                <div className="video-card video-card--skeleton" key={index} />
                            ))}
                        </div>
                    ) : filtered.length ? (
                        <>
                            {isMobile ? (
                                spotlightVideo ? (
                                    <Spotlight
                                        variant="overlay"
                                        video={spotlightVideo}
                                        onExit={handleSpotlightExit}
                                        returnFocusId={`spotlight-toggle-${spotlightVideo.id}`}
                                    />
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
                            <ul className="video-grid">
                                {filtered.map((video) => (
                                    <VideoCard
                                        key={video.id}
                                        video={video}
                                        isViewed={isViewed(video.id)}
                                        isPlaying={activePlayerId === video.id}
                                        onPlay={handleVideoPlay}
                                        isSpotlighted={video.id === spotlightId}
                                        onSpotlightToggle={handleSpotlightToggle}
                                    />
                                ))}
                            </ul>
                        </>
                    ) : (
                        <div className="video-empty" role="status">
                            No videos match that filter. Try clearing the search or switching tags.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};
