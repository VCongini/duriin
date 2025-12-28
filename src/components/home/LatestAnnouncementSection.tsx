import React from 'react';
import { Link } from 'react-router-dom';
import { Announcement } from '../../content/types';
import { AnnouncementCard } from '../AnnouncementCard';

export interface LatestAnnouncementSectionProps {
    announcement: Announcement | null;
}

export const LatestAnnouncementSection: React.FC<LatestAnnouncementSectionProps> = ({ announcement }) => {
    if (!announcement) {
        return null;
    }

    return (
        <section className="page-section u-stack announcement-spotlight">
            <header className="c-section-header c-section-header--accent">
                <p className="c-section-header__label">Announcements</p>
                <h2 className="c-section-header__title">Latest update</h2>
            </header>

            <AnnouncementCard announcement={announcement} variant="compact" ctaLabel="View full announcement" />

            <div className="page-cta">
                <Link className="page-cta__secondary" to="/announcements">
                    More updates
                </Link>
            </div>
        </section>
    );
};
