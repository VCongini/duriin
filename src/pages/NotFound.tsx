import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
    return (
        <div className="u-page u-stack-lg">
            <section className="page-section u-stack">
                <header className="c-section-header c-section-header--accent">
                    <p className="c-section-header__label">404</p>
                    <h1 className="c-section-header__title">Page not found</h1>
                </header>

                <div className="u-readable u-stack">
                    <p className="u-text-body">
                        The link you followed doesn&apos;t map to anything live. Pick a direction to keep moving
                        through the hub.
                    </p>
                </div>

                <div className="page-cta">
                    <Link to="/" className="btn btn--primary">
                        Return home
                    </Link>
                    <Link to="/videos" className="page-cta__secondary">
                        Browse the video archive
                    </Link>
                </div>
            </section>
        </div>
    );
};
