import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ContentGrid } from './components/ContentGrid';
import { Footer } from './components/Footer';

const App: React.FC = () => {
    return (
        <div className="app">
            <Header />
            <main className="app__main">
                <Hero />
                <ContentGrid />
            </main>
            <Footer />
        </div>
    );
};

export default App;
