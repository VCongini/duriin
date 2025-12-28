import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
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

const AppShell: React.FC = () => {
    const { mode, layout } = useTheme();

    return (
        <div className={`app app--${layout}`} data-theme-mode={mode} data-theme-layout={layout}>
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
