import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { findAnnouncement } from '../content';

const toParagraphs = (body?: string) => body?.split(/\n\s*\n/) ?? [];

export const AnnouncementDetail: React.FC = () => {
    const { announcementId } = useParams<{ announcementId: string }>();
    const announcement = useMemo(() => (announcementId ? findAnnouncement(announcementId) : undefined), [announcementId]);

    if (!announcement) {
        return (
            <div className="u-page u-stack-lg">
                <section className="page-section u-stack">
                    <header className="c-section-header c-section-header--accent">
                        <p className="c-section-header__label">Announcements</p>
                        <h2 className="c-section-header__title">Announcement not found</h2>
                    </header>
                    <p className="announcement-body announcement-body--muted">
                        We couldn&apos;t find that update. It may have been renamed or removed.
                    </p>
                    <div className="page-cta">
                        <Link className="page-cta__secondary" to="/announcements">
                            Back to archive
                        </Link>
                    </div>
                </section>
            </div>
        );
    }

    const paragraphs = toParagraphs(announcement.body);

    return (
        <div className="u-page u-stack-lg">
            <section className="page-section u-stack">
                <header className="c-section-header c-section-header--accent">
                    <p className="c-section-header__label">Announcements</p>
                    <h1 className="c-section-header__title">{announcement.title}</h1>
                </header>

                <AnnouncementCard announcement={announcement} showLink={false} />

                {paragraphs.length > 0 ? (
                    <article className="announcement-body">
                        {paragraphs.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </article>
                ) : (
                    <p className="announcement-body announcement-body--muted">
                        No additional details provided for this update.
                    </p>
                )}

                <div className="page-cta">
                    <Link className="page-cta__secondary" to="/announcements">
                        Back to archive
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default AnnouncementDetail;
