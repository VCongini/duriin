import React from 'react';

export interface VideoCardTitleProps {
    title: string;
    isPlaying: boolean;
    onPlay: () => void;
}

export const VideoCardTitle: React.FC<VideoCardTitleProps> = ({ title, isPlaying, onPlay }) => (
    <h3 className="video-card__title">
        <button type="button" onClick={onPlay} aria-pressed={isPlaying}>
            {title}
        </button>
    </h3>
);
