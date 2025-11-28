import React from 'react';
import { getExternalCtaLabel } from './videoCard.utils';

export interface VideoCardActionsProps {
    url: string;
    platform: string;
    ctaLabel?: string;
}

export const VideoCardActions: React.FC<VideoCardActionsProps> = ({ url, platform, ctaLabel }) => (
    <div className="video-card__actions">
        <a href={url} target="_blank" rel="noreferrer" className="page-cta__secondary">
            {ctaLabel ?? getExternalCtaLabel(platform)}
        </a>
    </div>
);
