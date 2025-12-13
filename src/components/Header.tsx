import React, { memo, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import onlineIcon from '../assets/icons/online.svg?raw';
import offlineIcon from '../assets/icons/offline.svg?raw';
import { ThemeSettings } from './ThemeSettings';

const STATUS_DEBOUNCE_MS = 150;

const HeaderComponent: React.FC = () => {
    const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));

    useEffect(() => {
        if (typeof window === 'undefined') return undefined;

        let debounceId: ReturnType<typeof setTimeout> | undefined;

        const updateStatus = (online: boolean) => {
            if (debounceId) {
                clearTimeout(debounceId);
            }

            debounceId = setTimeout(() => {
                setIsOnline((previous) => (previous === online ? previous : online));
            }, STATUS_DEBOUNCE_MS);
        };

        const handleOnline = () => updateStatus(true);
        const handleOffline = () => updateStatus(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            if (debounceId) {
                clearTimeout(debounceId);
            }

            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <header className="header">
            <a href="#main" className="skip-link">
                Skip to main content
            </a>
            <div className="header__primary">
                <div className="header__brand" aria-live="polite" role="status">
                    <span className="header__logo">DURIIN</span>
                    <div className="header__status">
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
                <div className="header__nav-controls">
                    <nav className="header__nav" aria-label="Primary">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/videos"
                            className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
                        >
                            Videos
                        </NavLink>
                        <NavLink
                            to="/blog"
                            className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
                        >
                            Blog
                        </NavLink>
                        <NavLink
                            to="/about"
                            className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
                        >
                            About
                        </NavLink>
                    </nav>
                    <div className="header__controls" aria-label="Theme and layout settings">
                        <ThemeSettings />
                    </div>
                </div>
            </div>
        </header>
    );
};

export const Header = memo(HeaderComponent);
Header.displayName = 'Header';
