import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Hero } from '../components/Hero';
import { announcements, getVideos } from '../content';
import { Announcement, FeaturedTopic, Video } from '../content/types';

const LatestAnnouncementSection = lazy(() =>
    import('../components/home/LatestAnnouncementSection').then((module) => ({
        default: module.LatestAnnouncementSection,
    }))
);

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

const SectionFallback: React.FC = () => (
    <section className="c-panel c-panel--loading u-stack" aria-live="polite" aria-busy="true">
        <div className="skeleton-block" style={{ width: '50%', height: '2rem' }} />
        <div className="skeleton-block" style={{ height: '8rem' }} />
    </section>
);

const shortenDescription = (value?: string, maxLength = 140) => {
    if (!value) {
        return null;
    }

    const cleaned = value.trim();
    if (cleaned.length <= maxLength) {
        return cleaned;
    }

    return `${cleaned.slice(0, maxLength).trim()}…`;
};

const getHighlightImage = (video: Video) => {
    if (video.thumbnailUrl) {
        return video.thumbnailUrl;
    }

    if (video.platform === 'YouTube') {
        return `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
    }

    return '';
};

const buildHighlightHref = (videoId: string) =>
    `/videos?spotlight=${encodeURIComponent(videoId)}`;

export const Home: React.FC = () => {
    const [latestVideos, setLatestVideos] = useState<Video[]>([]);
    const [isLoadingVideos, setIsLoadingVideos] = useState(true);
    const latestAnnouncement = useMemo<Announcement | null>(() => (announcements[0] ? announcements[0] : null), []);
    const featuredHighlights = useMemo<FeaturedTopic[]>(
        () =>
            latestVideos
                .map((video) => {
                    const image = getHighlightImage(video);
                    if (!image) {
                        return null;
                    }

                    return {
                        id: video.id,
                        title: video.title,
                        description:
                            shortenDescription(video.description) ??
                            `Spotlight ${video.platform} drop from ${video.title}.`,
                        image,
                        href: buildHighlightHref(video.id),
                        ctaLabel: 'Open in spotlight',
                    };
                })
                .filter((item): item is FeaturedTopic => Boolean(item)),
        [latestVideos]
    );

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
                {featuredHighlights.length ? (
                    <FeaturedCarousel items={featuredHighlights} />
                ) : isLoadingVideos ? (
                    <CarouselFallback />
                ) : null}
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
                <LatestAnnouncementSection announcement={latestAnnouncement} />
            </Suspense>
        </div>
    );
};
