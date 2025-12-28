// @ts-nocheck
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('YouTube feed contract', () => {
    it('exposes the expected JSON keys', () => {
        const fixturePath = resolve(process.cwd(), 'tests', '__fixtures__', 'youtubeFeedSample.json');
        const payload = JSON.parse(readFileSync(fixturePath, 'utf8'));

        assert.ok(payload.updatedAt, 'includes an updatedAt timestamp');
        assert.ok(typeof payload.version === 'number', 'includes a numeric version');
        assert.ok(Array.isArray(payload.items), 'items is an array');
        assert.ok(payload.items && payload.items.length > 0, 'items has at least one entry');

        const [first] = payload.items ?? [];
        assert.ok(first.id, 'video id present');
        assert.ok(first.title, 'video title present');
        assert.ok(first.publishedAt, 'video publishedAt present');
        assert.ok(String(first.url).startsWith('https://'), 'video url is absolute');
        assert.ok(first.thumbnails?.default, 'video thumbnails include a default size');
    });
});
