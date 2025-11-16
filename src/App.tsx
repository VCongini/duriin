import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Featured } from './pages/Featured';
import { Videos } from './pages/Videos';
import { About } from './pages/About';

type ThemeMode = 'light' | 'dark';

const App: React.FC = () => {
    const [theme, setTheme] = useState<ThemeMode>(() => {
        const stored = localStorage.getItem('theme');
        if (stored === 'light' || stored === 'dark') return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

    return (
        <div className="app" data-theme={theme}>
            <Header theme={theme} onToggleTheme={toggleTheme} />
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
