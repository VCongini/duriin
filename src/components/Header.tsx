import React from 'react';
import { Link, useLocation } from 'react-router-dom';

type HeaderProps = {
    theme: 'dark' | 'light';
    design: 'brutalist' | 'modern';
    onToggleTheme: () => void;
    onDesignChange: (design: 'brutalist' | 'modern') => void;
};

export const Header: React.FC<HeaderProps> = ({ theme, design, onToggleTheme, onDesignChange }) => {
    const location = useLocation();
    const isActive = (path: string) => (location.pathname === path ? 'header__link--active' : '');

    return (
        <header className="header">
            <div className="header__left">
                <span className="header__logo">DURIIN</span>
                <span className="header__tagline">GAME SIGNALS</span>
            </div>
            <nav className="header__nav" aria-label="Primary">
                <Link to="/" className={`header__link ${isActive('/')}`}>
                    Home
                </Link>
                <Link to="/featured" className={`header__link ${isActive('/featured')}`}>
                    Featured
                </Link>
                <Link to="/videos" className={`header__link ${isActive('/videos')}`}>
                    Videos
                </Link>
                <Link to="/about" className={`header__link ${isActive('/about')}`}>
                    About
                </Link>
            </nav>
            <div className="header__controls">
                <label className="design-select">
                    <span className="design-select__label">Style</span>
                    <select
                        className="design-select__field"
                        value={design}
                        onChange={(event) => onDesignChange(event.target.value as HeaderProps['design'])}
                    >
                        <option value="brutalist">Brutalist</option>
                        <option value="modern">Modern</option>
                    </select>
                </label>
                <button
                    type="button"
                    className="theme-toggle"
                    onClick={onToggleTheme}
                    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                    {theme === 'dark' ? 'Light' : 'Dark'} mode
                </button>
            </div>
        </header>
    );
};
