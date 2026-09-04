import assert from 'node:assert';
import { test } from 'node:test';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import { Header } from '../src/components/Header';
import { ThemeProvider } from '../src/theme/ThemeContext';

const renderHeader = () =>
    renderToString(
        <StaticRouter location="/">
            <ThemeProvider>
                <Header />
            </ThemeProvider>
        </StaticRouter>
    );

test('Header renders its primary navigation and skip link', () => {
    const html = renderHeader();

    assert(html.includes('href="#main"'));
    assert(html.includes('aria-label="Primary"'));
    assert(html.includes('href="/videos"'));
    assert(html.includes('href="/about"'));
    assert(html.includes('<details'));
    assert(html.includes('<summary'));
    assert(html.includes('Appearance'));
    assert(!html.includes('header__status-light'));
});
