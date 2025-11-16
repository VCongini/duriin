import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Featured } from './pages/Featured';
import { Videos } from './pages/Videos';
import { About } from './pages/About';

type ThemeMode = 'light' | 'dark';
type DesignStyle = 'brutalist' | 'modern';

const App: React.FC = () => {
    const [theme, setTheme] = useState<ThemeMode>(() => {
        const stored = localStorage.getItem('theme');
        if (stored === 'light' || stored === 'dark') return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    });
    const [design, setDesign] = useState<DesignStyle>(() => {
        const stored = localStorage.getItem('design');
        return stored === 'modern' ? 'modern' : 'brutalist';
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('design', design);
        document.documentElement.setAttribute('data-design', design);
    }, [design]);

    const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    const handleDesignChange = (next: DesignStyle) => setDesign(next);

    return (
        <div className={`app app--${design}`} data-theme={theme} data-design={design}>
            <Header
                theme={theme}
                design={design}
                onToggleTheme={toggleTheme}
                onDesignChange={handleDesignChange}
            />
            <main className="app__main">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/featured" element={<Featured />} />
                    <Route path="/videos" element={<Videos />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

export default App;
