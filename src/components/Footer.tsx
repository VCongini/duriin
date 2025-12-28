import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';

const FooterComponent: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer" aria-label="Site footer">
            <div className="footer__inner u-page">
                <div className="footer__section footer__identity">
                    <p className="footer__copy">
                        © {currentYear} Duriin (Vincent Congini). All rights reserved.
                    </p>
                </div>

                <nav className="footer__section footer__links" aria-label="Utility">
                    <NavLink to="/" end className={({ isActive }) => `footer__link ${isActive ? 'is-active' : ''}`}>
                        Home
                    </NavLink>
                    <NavLink to="/videos" className={({ isActive }) => `footer__link ${isActive ? 'is-active' : ''}`}>
                        Videos
                    </NavLink>
                    <NavLink
                        to="/announcements"
                        className={({ isActive }) => `footer__link ${isActive ? 'is-active' : ''}`}
                    >
                        Announcements
                    </NavLink>
                    <a className="footer__link" href="mailto:theincomparableduriin@gmail.com">
                        Email
                    </a>
                </nav>

                <div className="footer__section footer__signals" aria-label="Signal links">
                    <a
                        className="footer__link footer__link--signal"
                        href="https://github.com/vcongini/duriin"
                        target="_blank"
                        rel="noreferrer"
                    >
                        GitHub Repo
                    </a>
                    <a
                        className="footer__link footer__link--signal"
                        href="https://www.youtube.com/@duriin6656"
                        target="_blank"
                        rel="noreferrer"
                    >
                        YouTube
                    </a>
                    <a
                        className="footer__link footer__link--signal"
                        href="https://twitter.com"
                        target="_blank"
                        rel="noreferrer"
                    >
                        X / Twitter
                    </a>
                </div>
            </div>
        </footer>
    );
};

export const Footer = memo(FooterComponent);
Footer.displayName = 'Footer';
