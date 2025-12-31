import React from 'react';
import spotlightIcon from '../../../assets/icons/spotlight.svg?raw';
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
                className={`btn btn--ghost spotlight-toggle ${isSpotlighted ? 'is-active' : ''}`}
                aria-pressed={isSpotlighted}
                onClick={onSpotlightToggle}
                aria-label={isSpotlighted ? 'Exit Spotlight' : 'Enter Spotlight'}
            >
                <span className="sr-only">{isSpotlighted ? 'Exit Spotlight' : 'Enter Spotlight'}</span>
                <span
                    className="spotlight-toggle__icon"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: spotlightIcon }}
                />
                <span className="spotlight-toggle__hover-hint">Spotlight</span>
            </button>
        ) : null}
        <a href={url} target="_blank" rel="noreferrer" className="page-cta__secondary">
            {ctaLabel ?? getExternalCtaLabel(platform)}
        </a>
    </div>
);
