import React from 'react';

export interface VideoCardHeaderProps {
    platform: string;
    status?: string;
    showStatus: boolean;
}

export const VideoCardHeader: React.FC<VideoCardHeaderProps> = ({ platform, status, showStatus }) => (
    <>
        <span className="tag tag--platform">#{platform.toUpperCase()}</span>
        {showStatus ? <span className={`episode__status episode__status--${status?.toLowerCase()}`}>{status}</span> : null}
    </>
);
