import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import onlineIcon from '../assets/icons/online.svg?raw';
import offlineIcon from '../assets/icons/offline.svg?raw';
import { ThemeSettings } from './ThemeSettings';

const HeaderComponent: React.FC = () => {
    const location = useLocation();
    const isActive = (path: string) => (location.pathname === path ? 'header__link--active' : '');

    const isOnline = true;

    return (
        <header className="header">
            <a href="#main" className="skip-link">
                Skip to main content
            </a>
            <div className="header__left">
                <span className="header__logo">DURIIN</span>
                <div className="header__status" aria-live="polite" role="status">
                    <span
                        className={`header__status-light header__status-light--${isOnline ? 'online' : 'offline'}`}
                        aria-label={isOnline ? 'Online' : 'Offline'}
                        role="img"
                    />
                    <span
                        className="header__status-icon"
                        aria-hidden="true"
                        dangerouslySetInnerHTML={{ __html: isOnline ? onlineIcon : offlineIcon }}
                    />
                </div>
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
