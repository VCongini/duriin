import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeSettings } from './ThemeSettings';

const HeaderComponent: React.FC = () => {
    const location = useLocation();
    const isActive = (path: string) => (location.pathname === path ? 'header__link--active' : '');

    return (
        <header className="header">
            <a href="#main" className="skip-link">
                Skip to main content
            </a>
            <div className="header__left">
                <span className="header__logo">DURIIN</span>
                <span className="header__tagline">GAME FEED</span>
            </div>
            <nav className="header__nav" aria-label="Primary">
                <Link to="/" className={`header__link ${isActive('/')}`}>
                    Home
                </Link>
                <Link to="/videos" className={`header__link ${isActive('/videos')}`}>
                    Videos
                </Link>
                <Link to="/about" className={`header__link ${isActive('/about')}`}>
                    About
                </Link>
            </nav>
            <ThemeSettings />
        </header>
    );
};

export const Header = memo(HeaderComponent);
Header.displayName = 'Header';
