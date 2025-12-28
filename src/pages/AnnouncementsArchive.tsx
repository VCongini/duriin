import React from 'react';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { announcements } from '../content';

export const AnnouncementsArchive: React.FC = () => (
    <div className="u-page u-stack-lg">
        <section className="page-section u-stack">
            <header className="c-section-header c-section-header--accent">
                <p className="c-section-header__label">Announcements</p>
                <h2 className="c-section-header__title">Release notes &amp; status</h2>
                <p className="c-section-header__description">
                    Short, high-signal updates covering deployments, site news, and roadmap tweaks.
                </p>
            </header>

            <div className="announcement-list" role="list">
                {announcements.map((announcement) => (
                    <AnnouncementCard key={announcement.id} announcement={announcement} />
                ))}
            </div>
        </section>
    </div>
);

export default AnnouncementsArchive;
