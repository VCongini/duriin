import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { findAnnouncement } from './content';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { ThemeProvider, useTheme } from './theme/ThemeContext';

// Lazily load heavier secondary routes so the initial bundle only ships
// the Home experience and shared chrome.
const Videos = lazy(() => import('./pages/Videos').then((module) => ({ default: module.Videos })));
const About = lazy(() => import('./pages/About').then((module) => ({ default: module.About })));
const AnnouncementsArchive = lazy(() =>
    import('./pages/AnnouncementsArchive').then((module) => ({ default: module.AnnouncementsArchive }))
);
const AnnouncementDetail = lazy(() =>
    import('./pages/AnnouncementDetail').then((module) => ({ default: module.AnnouncementDetail }))
);

const SITE_NAME = "Duriin's Hub";
const SITE_URL = 'https://duriin.com';

const RouteMetadata: React.FC = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        let title = SITE_NAME;
        let description = 'Gaming moments, late-night builds, and coding experiments from Duriin.';

        if (pathname === '/videos') {
            title = `Videos | ${SITE_NAME}`;
            description = "Browse Duriin's latest gaming videos, clips, and archived highlights.";
        } else if (pathname === '/about') {
            title = `About | ${SITE_NAME}`;
            description = 'Learn about Duriin and find the channel across YouTube, Twitch, TikTok, and X.';
        } else if (pathname === '/announcements') {
            title = `Announcements | ${SITE_NAME}`;
            description = 'Read release notes and status updates from Duriin.';
        } else if (pathname.startsWith('/announcements/')) {
            const announcement = findAnnouncement(pathname.split('/').pop() ?? '');
            title = announcement ? `${announcement.title} | ${SITE_NAME}` : `Announcement not found | ${SITE_NAME}`;
            description = announcement?.summary ?? 'The requested announcement could not be found.';
        } else if (pathname !== '/') {
            title = `Page not found | ${SITE_NAME}`;
            description = 'The requested page could not be found.';
        }

        document.title = title;
        document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', description);
        document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', title);
        document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', description);
        document
            .querySelector<HTMLMetaElement>('meta[property="og:url"]')
            ?.setAttribute('content', `${SITE_URL}${pathname === '/' ? '/' : pathname}`);
        document
            .querySelector<HTMLLinkElement>('link[rel="canonical"]')
            ?.setAttribute('href', `${SITE_URL}${pathname === '/' ? '/' : pathname}`);
    }, [pathname]);

    return null;
};

const AppShell: React.FC = () => {
    const { mode, layout } = useTheme();

    return (
        <div className={`app app--${layout}`} data-theme-mode={mode} data-theme-layout={layout}>
            <RouteMetadata />
            <Header />
            <main className="app__main" id="main">
                <Suspense
                    fallback={
                        <div className="app__loader" role="status" aria-live="polite">
                            Loading experience…
                        </div>
                    }
                >
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/announcements" element={<AnnouncementsArchive />} />
                        <Route path="/announcements/:announcementId" element={<AnnouncementDetail />} />
                        <Route path="/videos" element={<Videos />} />
                        <Route path="/about" element={<About />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </main>
            <Footer />
        </div>
    );
};

const App: React.FC = () => (
    <ThemeProvider>
        <AppShell />
    </ThemeProvider>
);

export default App;
