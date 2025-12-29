import React from 'react';
import { getExternalCtaLabel } from './videoCard.utils';

export interface VideoCardActionsProps {
    url: string;
    platform: string;
    ctaLabel?: string;
    isSpotlighted?: boolean;
    onSpotlightToggle?: () => void;
}

export const VideoCardActions: React.FC<VideoCardActionsProps> = ({
    url,
    platform,
    ctaLabel,
    isSpotlighted = false,
    onSpotlightToggle
}) => (
    <div className="video-card__actions">
        {onSpotlightToggle ? (
            <button
                type="button"
                className={`btn btn--ghost ${isSpotlighted ? 'is-active' : ''}`}
                aria-pressed={isSpotlighted}
                onClick={onSpotlightToggle}
            >
                {isSpotlighted ? 'Exit Spotlight' : 'Spotlight'}
            </button>
        ) : null}
        <a href={url} target="_blank" rel="noreferrer" className="page-cta__secondary">
            {ctaLabel ?? getExternalCtaLabel(platform)}
        </a>
    </div>
);
