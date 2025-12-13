import assert from 'node:assert';
import { test } from 'node:test';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

import { Header } from '../src/components/Header';
import { ThemeProvider } from '../src/theme/ThemeContext';

type NavigatorStub = Pick<Navigator, 'onLine'>;

const originalNavigator = globalThis.navigator;

const renderHeader = () =>
    renderToString(
        <MemoryRouter>
            <ThemeProvider>
                <Header />
            </ThemeProvider>
        </MemoryRouter>
    );

const withNavigatorStatus = (status: boolean, run: () => void) => {
    const stub: NavigatorStub = { onLine: status };
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    globalThis.navigator = stub as Navigator;

    try {
        run();
    } finally {
        if (originalNavigator) {
            globalThis.navigator = originalNavigator;
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (globalThis as any).navigator;
        }
    }
};

test('Header shows online state by default when navigator reports online', () => {
    withNavigatorStatus(true, () => {
        const html = renderHeader();

        assert(html.includes('header__status-light--online'));
        assert(html.includes('aria-label="Online"'));
    });
});

test('Header shows offline state when navigator reports offline', () => {
    withNavigatorStatus(false, () => {
        const html = renderHeader();

        assert(html.includes('header__status-light--offline'));
        assert(html.includes('aria-label="Offline"'));
    });
});
