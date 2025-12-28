import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Hero } from '../components/Hero';
import { announcements, featuredTopics, getVideos } from '../content';
import { Announcement, Video } from '../content/types';

const LatestVideosSection = lazy(() =>
    import('../components/home/LatestVideosSection').then((module) => ({ default: module.LatestVideosSection }))
);

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

export const Home: React.FC = () => {
    const [latestVideos, setLatestVideos] = useState<Video[]>([]);
    const [isLoadingVideos, setIsLoadingVideos] = useState(true);
    const latestAnnouncement = useMemo<Announcement | null>(() => (announcements[0] ? announcements[0] : null), []);

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

            <Suspense fallback={<SectionFallback />}>
                <LatestVideosSection latestVideos={latestVideos} isLoading={isLoadingVideos} />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
                <LatestAnnouncementSection announcement={latestAnnouncement} />
            </Suspense>
        </div>
    );
};
