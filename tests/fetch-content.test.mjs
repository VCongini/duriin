import assert from 'node:assert/strict';
import { test } from 'node:test';

import { fetchJson, replaceProviderRecords } from '../scripts/fetch-content.mjs';

const existing = [
    { id: 'youtube-old', platform: 'YouTube' },
    { id: 'twitch-old', platform: 'Twitch' },
    { id: 'tiktok-old', platform: 'TikTok' },
];

test('provider replacement never prunes records for an empty refresh', () => {
    assert.deepEqual(replaceProviderRecords(existing, 'YouTube', []), existing);
});

test('provider replacement prunes only the successfully refreshed provider', () => {
    assert.deepEqual(replaceProviderRecords(existing, 'YouTube', [{ id: 'youtube-new', platform: 'YouTube' }]), [
        { id: 'youtube-new', platform: 'YouTube' },
        { id: 'twitch-old', platform: 'Twitch' },
        { id: 'tiktok-old', platform: 'TikTok' },
    ]);
});

test('request errors omit query-string secrets', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response(null, { status: 401 });

    try {
        await assert.rejects(
            fetchJson('https://example.com/videos?key=secret-api-key&client_secret=secret-client'),
            (error) => {
                assert.match(error.message, /Fetch failed 401 for https:\/\/example\.com\/videos/);
                assert.doesNotMatch(error.message, /secret-api-key|secret-client|client_secret/);
                return true;
            }
        );
    } finally {
        globalThis.fetch = originalFetch;
    }
});
