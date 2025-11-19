import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeSettings } from './ThemeSettings';

type FocusPose = 'play' | 'edit' | 'code';

const StickFigureIcon: React.FC<{ title: string; pose: FocusPose }> = ({ title, pose }) => {
    const rightArmX = pose === 'edit' ? 26 : pose === 'code' ? 22 : 24;
    const leftArmX = pose === 'play' ? 6 : pose === 'edit' ? 10 : 12;
    const leftLegX = pose === 'play' ? 8 : pose === 'edit' ? 12 : 10;
    const rightLegX = pose === 'code' ? 20 : 22;

    return (
        <svg
            viewBox="0 0 32 32"
            role="img"
            aria-label={title}
            className={`header__status-figure header__status-figure--${pose}`}
        >
            <title>{title}</title>
            <circle cx="16" cy="7" r="4" />
            <line x1="16" y1="11" x2="16" y2="19" />
            <line x1="16" y1="14" x2={rightArmX} y2={pose === 'code' ? 14 : 12} />
            <line x1="16" y1="14" x2={leftArmX} y2={pose === 'play' ? 15 : 12} />
            <line x1="16" y1="19" x2={leftLegX} y2="26" />
            <line x1="16" y1="19" x2={rightLegX} y2={pose === 'edit' ? 24 : 26} />
        </svg>
    );
};

const HeaderComponent: React.FC = () => {
    const location = useLocation();
    const isActive = (path: string) => (location.pathname === path ? 'header__link--active' : '');

    const isOnline = true;
    const activePose: FocusPose = 'play';
    const poseLabel = activePose === 'play' ? 'Gaming' : activePose === 'edit' ? 'Editing' : 'Building';

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
                    {isOnline && (
                        <span className="header__status-icon" title={poseLabel} aria-label={poseLabel}>
                            <StickFigureIcon title={poseLabel} pose={activePose} />
                        </span>
                    )}
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
