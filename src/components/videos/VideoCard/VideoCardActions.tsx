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
                className={`btn btn--ghost spotlight-toggle ${isSpotlighted ? 'is-active' : ''}`}
                aria-pressed={isSpotlighted}
                onClick={onSpotlightToggle}
                aria-label={isSpotlighted ? 'Exit Spotlight' : 'Enter Spotlight'}
            >
                <span className="sr-only">{isSpotlighted ? 'Exit Spotlight' : 'Enter Spotlight'}</span>
                <span className="spotlight-toggle__icon" aria-hidden="true">
                    <svg viewBox="0 0 48 48" role="presentation" focusable="false">
                        <path d="M26.2 6.5 41 10.6c1 .3 1.6 1.4 1.3 2.4l-5 16.7c-.2.6-.6 1-1.1 1.3l-4.9 2.6-2.7 9.1a1.9 1.9 0 0 1-2.4 1.3l-6.7-2a1.9 1.9 0 0 1-1.3-2.4l2.7-9-4.3-2.2c-.5-.3-.9-.7-1-1.3l-3-9.6a1.9 1.9 0 0 1 1.3-2.4l15.1-4.9c.5-.2 1-.2 1.5 0Z" />
                        <circle cx="24" cy="22.5" r="4.5" />
                        <path d="M14 20.5 8 22" strokeWidth="3" strokeLinecap="round" />
                        <path d="m33.5 12.5 3.5.9" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                </span>
                <span className="spotlight-toggle__hover-hint">Spotlight</span>
            </button>
        ) : null}
        <a href={url} target="_blank" rel="noreferrer" className="page-cta__secondary">
            {ctaLabel ?? getExternalCtaLabel(platform)}
        </a>
    </div>
);
