// Refactored into subcomponents (thumbnail, header, meta, actions) to keep the video card maintainable.
import React from 'react';
import { Video } from '../../../content/types';
import { VideoCardActions } from './VideoCardActions';
import { VideoCardHeader } from './VideoCardHeader';
import { VideoCardMeta } from './VideoCardMeta';
import { VideoCardThumbnail } from './VideoCardThumbnail';
import { VideoCardTitle } from './VideoCardTitle';
import { createTeaser, shouldShowStatus } from './videoCard.utils';

export interface VideoCardProps {
    video: Video;
    isActive: boolean;
    onSelect: (id: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, isActive, onSelect }) => {
    const handleSelect = () => onSelect(video.id);
    const teaser = createTeaser(video.description ?? video.title);

    return (
        <article
            className={`video-card ${isActive ? 'is-active' : ''}`}
            role="listitem"
            aria-current={isActive ? 'true' : undefined}
            onClick={handleSelect}
        >
            <VideoCardThumbnail
                thumbnailUrl={video.thumbnailUrl}
                platform={video.platform}
                title={video.title}
                isActive={isActive}
                onSelect={handleSelect}
            />
            <div className="video-card__body u-stack">
                <div className="video-card__eyebrow">
                    <VideoCardHeader
                        platform={video.platform}
                        status={video.status}
                        showStatus={shouldShowStatus(video.status)}
                    />
                    <VideoCardMeta duration={video.duration} publishedAt={video.publishedAt} showTags={false} />
                </div>
                <VideoCardTitle title={video.title} isActive={isActive} onSelect={handleSelect} />
                <p className="video-card__teaser u-text-body">{teaser}</p>
                <div className="video-card__footer">
                    <VideoCardMeta
                        duration={video.duration}
                        publishedAt={video.publishedAt}
                        tags={video.tags}
                        showDuration={false}
                        showDate={false}
                        showTags
                    />
                    <VideoCardActions url={video.url} platform={video.platform} />
                </div>
            </div>
        </article>
    );
};

export default VideoCard;
