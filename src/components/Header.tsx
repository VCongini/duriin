import React, { memo, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import onlineIcon from '../assets/icons/online.svg?raw';
import offlineIcon from '../assets/icons/offline.svg?raw';
import { ThemeSettings } from './ThemeSettings';

const HeaderComponent: React.FC = () => {
    const location = useLocation();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const isActive = (path: string) => (location.pathname === path ? 'header__link--active' : '');

    const isOnline = true;

    useEffect(() => {
        setIsSettingsOpen(false);
    }, [location.pathname]);

    return (
        <header className={`header ${isSettingsOpen ? 'is-settings-open' : ''}`}>
            <a href="#main" className="skip-link">
                Skip to main content
            </a>
            <div className="header__top">
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
                <div className="header__actions">
                    <button
                        type="button"
                        className={`header__menu-toggle ${isSettingsOpen ? 'is-open' : ''}`}
                        aria-expanded={isSettingsOpen}
                        aria-controls="header-theme-settings"
                        onClick={() => setIsSettingsOpen((open) => !open)}
                    >
                        <span className="sr-only">Toggle theme settings</span>
                        <svg
                            className="header__menu-icon"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            role="img"
                            aria-hidden="true"
                            focusable="false"
                        >
                            <rect
                                className="header__menu-icon-bar header__menu-icon-bar--top"
                                x="4"
                                y="7"
                                width="16"
                                height="2"
                                rx="1"
                            />
                            <rect
                                className="header__menu-icon-bar header__menu-icon-bar--middle"
                                x="4"
                                y="11"
                                width="16"
                                height="2"
                                rx="1"
                            />
                            <rect
                                className="header__menu-icon-bar header__menu-icon-bar--bottom"
                                x="4"
                                y="15"
                                width="16"
                                height="2"
                                rx="1"
                            />
                        </svg>
                    </button>
                    <div
                        id="header-theme-settings"
                        className={`header__settings ${isSettingsOpen ? 'is-open' : ''}`}
                        aria-live="polite"
                    >
                        <ThemeSettings />
                    </div>
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
        </header>
    );
};

export const Header = memo(HeaderComponent);
Header.displayName = 'Header';
