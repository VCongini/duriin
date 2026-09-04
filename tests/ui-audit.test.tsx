import assert from 'node:assert';
import { test } from 'node:test';
import React from 'react';
import { renderToString } from 'react-dom/server';

import { AnnouncementCard } from '../src/components/AnnouncementCard';
import { Spotlight } from '../src/components/videos/Spotlight';
import { VideoCardMeta } from '../src/components/videos/VideoCard/VideoCardMeta';
import { VideoCardThumbnail } from '../src/components/videos/VideoCard/VideoCardThumbnail';
import { getTagOptions, videoHasTag } from '../src/components/videos/videoFilters';
import { Announcement, Video } from '../src/content/types';

const video: Video = {
    id: 'clip-1',
    episode: 'CLIP',
    title: 'Example clip',
    platform: 'TikTok',
    url: 'https://example.com/clip',
    thumbnailUrl: 'https://example.com/clip.jpg',
    duration: '01:07',
    status: 'LIVE',
    tags: ['duriin', 'Duriin', 'Dnd', 'dnd', 'DnD'],
    publishedAt: '2026-01-01'
};

const announcement: Announcement = {
    id: 'update-1',
    title: 'Example update',
    date: '2026-01-01',
    summary: 'A concise update.'
};

test('video card exposes keyboard-operable tag disclosure and a complete media label', () => {
    const metaHtml = renderToString(
        <VideoCardMeta publishedAt={video.publishedAt} tags={video.tags} showTags />
    );
    const thumbnailHtml = renderToString(
        <VideoCardThumbnail
            thumbnailUrl={video.thumbnailUrl}
            platform={video.platform}
            title={video.title}
            externalUrl={video.url}
            isPlaying={false}
            onPlay={() => {}}
            duration={video.duration}
            isViewed={false}
        />
    );

    assert.match(metaHtml, /<button[^>]+aria-expanded="false"[^>]+aria-controls="[^"]+"/);
    assert.match(metaHtml, /role="region"/);
    assert(!thumbnailHtml.includes('aria-label='));
    assert.match(thumbnailHtml, /class="sr-only">: .*Example clip/);
});

test('tag options merge case-only duplicates and filters case-insensitively', () => {
    const options = getTagOptions([video]);

    assert.deepStrictEqual(
        options.map(({ value, label }) => ({ value, label })),
        [
            { value: 'dnd', label: 'DnD' },
            { value: 'duriin', label: 'Duriin' }
        ]
    );
    assert(videoHasTag(video, 'DND'));
});

test('spotlight fallback names the source platform', () => {
    const html = renderToString(<Spotlight variant="row" video={video} onExit={() => {}} />);

    assert.match(html, /Watch on.*TikTok/);
    assert(!html.includes('Watch on YouTube'));
});

test('announcement cards support page-appropriate heading levels and title-free detail summaries', () => {
    const archiveHtml = renderToString(
        <AnnouncementCard announcement={announcement} headingLevel="h2" />
    );
    const detailHtml = renderToString(
        <AnnouncementCard announcement={announcement} showTitle={false} />
    );

    assert.match(archiveHtml, /<h2[^>]*>.*Example update.*<\/h2>/);
    assert(!detailHtml.includes('<h2'));
    assert(!detailHtml.includes('<h3'));
    assert(detailHtml.includes('aria-label="Example update summary"'));
});
