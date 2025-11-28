import React from 'react';

export interface VideoCardTitleProps {
    title: string;
    isActive: boolean;
    onSelect: () => void;
}

export const VideoCardTitle: React.FC<VideoCardTitleProps> = ({ title, isActive, onSelect }) => (
    <h3 className="video-card__title">
        <button type="button" onClick={onSelect} aria-pressed={isActive}>
            {title}
        </button>
    </h3>
);
