import React from 'react';
import { Link } from 'react-router-dom';
import { Announcement } from '../content/types';
import { formatDate } from '../utils/format';

export type AnnouncementCardVariant = 'default' | 'compact';

export interface AnnouncementCardProps {
    announcement: Announcement;
    variant?: AnnouncementCardVariant;
    ctaLabel?: string;
    showLink?: boolean;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
    announcement,
    variant = 'default',
    ctaLabel = 'Read update',
    showLink = true,
}) => {
    const hasBody = Boolean(announcement.body);
    const shouldLinkToDetail = hasBody && showLink;

    return (
        <article className={`announcement ${variant === 'compact' ? 'announcement--compact' : ''}`}>
            <div className="announcement__meta">
                <span className="announcement__label">Updates</span>
                <span className="announcement__date">{formatDate(announcement.date, { month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="announcement__content">
                <h3 className="announcement__title">
                    {shouldLinkToDetail ? (
                        <Link to={`/announcements/${announcement.id}`}>{announcement.title}</Link>
                    ) : (
                        announcement.title
                    )}
                </h3>
                <p className="announcement__summary">{announcement.summary}</p>
                {shouldLinkToDetail && (
                    <Link className="announcement__link" to={`/announcements/${announcement.id}`}>
                        {ctaLabel}
                    </Link>
                )}
            </div>
        </article>
    );
};
