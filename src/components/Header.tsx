import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeSettings } from './ThemeSettings';

const HeaderComponent: React.FC = () => {
    return (
        <header className="header">
            <a href="#main" className="skip-link">
                Skip to main content
            </a>
            <div className="header__primary">
                <div className="header__brand">
                    <span className="header__logo">DURIIN</span>
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
