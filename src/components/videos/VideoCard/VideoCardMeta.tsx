import React from 'react';
import { getTagOptions } from '../videoFilters';
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
    const tagOptions = React.useMemo(
        () => getTagOptions([{ tags }]),
        [tags]
    );
    const tagCount = showTags ? tagOptions.length : 0;
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const popoverId = React.useId();

    const handleMetaMouseDown = (event: React.SyntheticEvent) => {
        event.stopPropagation();
    };

    const handleMetaClick = (event: React.SyntheticEvent) => {
        event.stopPropagation();
    };

    const handlePopoverClick = (event: React.SyntheticEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setIsPopoverOpen((current) => !current);
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
                    className={`video-card__tag-disclosure ${isPopoverOpen ? 'is-open' : ''}`}
                    onMouseLeave={handlePopoverLeave}
                    onMouseDown={handleMetaMouseDown}
                    onMouseUp={handleMetaMouseDown}
                >
                    <button
                        type="button"
                        className="video-card__tag-counter"
                        aria-label={`${isPopoverOpen ? 'Hide' : 'Show'} ${tagCount} tags`}
                        aria-expanded={isPopoverOpen}
                        aria-controls={popoverId}
                        onClick={handlePopoverClick}
                        onBlur={handlePopoverLeave}
                    >
                        <span className="video-card__tag-count">{tagCount}</span>
                    </button>
                    <div
                        className="video-card__tag-popover"
                        id={popoverId}
                        role="region"
                        aria-label="Video tags"
                        aria-hidden={!isPopoverOpen}
                    >
                        <div className="video-card__tag-popover-inner">
                            <div className="video-card__tag-popover-title">Tags</div>
                            <div className="video-card__tag-grid">
                                {tagOptions.map((tag) => (
                                    <span key={tag.value} className="tag tag--content">
                                        #{tag.label}
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
