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

    return (
        <>
            {showDuration && duration ? <span className="tag tag--meta">{duration}</span> : null}
            {showDate ? <span className="tag tag--meta">{formatRelativeDate(publishedAt)}</span> : null}
            {showTags && tagCount > 0 ? (
                <div className="video-card__tag-counter" aria-label={`${tagCount} tags`}>
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
        </>
    );
};
