import React from 'react';
import { formatRelativeDate } from './videoCard.utils';

export interface VideoCardMetaProps {
    duration?: string;
    publishedAt: string;
    tags?: string[];
    showDuration?: boolean;
    showDate?: boolean;
    showTags?: boolean;
}

export const VideoCardMeta: React.FC<VideoCardMetaProps> = ({
    duration,
    publishedAt,
    tags = [],
    showDuration = true,
    showDate = true,
    showTags = false
}) => {
    const tagCount = showTags ? tags.length : 0;
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    const handleMetaMouseDown = (event: React.SyntheticEvent) => {
        event.stopPropagation();
    };

    const handleMetaClick = (event: React.SyntheticEvent) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handlePopoverEnter = (event: React.SyntheticEvent) => {
        event.stopPropagation();
        setIsPopoverOpen(true);
    };

    const handlePopoverLeave = () => {
        setIsPopoverOpen(false);
    };

    return (
        <div
            className="video-card__meta"
            onMouseDown={handleMetaMouseDown}
            onClick={handleMetaClick}
        >
            {showDuration && duration ? <span className="tag tag--meta">{duration}</span> : null}
            {showDate ? <span className="tag tag--meta">{formatRelativeDate(publishedAt)}</span> : null}
            {showTags && tagCount > 0 ? (
                <div
                    className={`video-card__tag-counter ${isPopoverOpen ? 'is-open' : ''}`}
                    aria-label={`${tagCount} tags`}
                    aria-expanded={isPopoverOpen}
                    onMouseEnter={handlePopoverEnter}
                    onMouseLeave={handlePopoverLeave}
                    onMouseDown={handleMetaMouseDown}
                    onMouseUp={handleMetaMouseDown}
                    onClick={handleMetaClick}
                    onFocus={handlePopoverEnter}
                    onBlur={handlePopoverLeave}
                >
                    <span className="video-card__tag-count">{tagCount}</span>
                    <div className="video-card__tag-popover" role="presentation">
                        <div className="video-card__tag-popover-inner">
                            <div className="video-card__tag-popover-title">Tags</div>
                            <div className="video-card__tag-grid">
                                {tags.map((tag) => (
                                    <span key={tag} className="tag tag--content">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};
