import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="header__left">
                <span className="header__logo">DURIIN</span>
                <span className="header__tagline">BRUTALIST TRANSMISSIONS</span>
            </div>
            <nav className="header__nav">
                <a href="#featured" className="header__link">
                    Featured
                </a>
                <a href="#videos" className="header__link">
                    Videos
                </a>
                <a href="#about" className="header__link">
                    About
                </a>
            </nav>
        </header>
    );
};
