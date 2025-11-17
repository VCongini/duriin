import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Featured } from './pages/Featured';
import { Videos } from './pages/Videos';
import { About } from './pages/About';
import { ThemeProvider, useTheme } from './theme/ThemeContext';

const AppShell: React.FC = () => {
    const { mode, layout } = useTheme();

    return (
        <div className={`app app--${layout}`} data-theme-mode={mode} data-theme-layout={layout}>
            <Header />
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

const App: React.FC = () => (
    <ThemeProvider>
        <AppShell />
    </ThemeProvider>
);

export default App;
