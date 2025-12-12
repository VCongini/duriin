import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeMode = 'light' | 'dark';
export type ThemeLayout = 'brutalist' | 'modern';

type ThemeContextValue = {
    mode: ThemeMode;
    layout: ThemeLayout;
    setMode: (mode: ThemeMode) => void;
    toggleMode: () => void;
    setLayout: (layout: ThemeLayout) => void;
};

const MODE_STORAGE_KEY = 'duriin-theme-mode';
const LAYOUT_STORAGE_KEY = 'duriin-theme-layout';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getPreferredMode = (): ThemeMode => {
    if (typeof document !== 'undefined') {
        const preset = document.documentElement.getAttribute('data-theme-mode');
        if (preset === 'light' || preset === 'dark') {
            return preset;
        }
    }

    if (typeof window === 'undefined') {
        return 'dark';
    }

    const stored = localStorage.getItem(MODE_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
        return stored;
    }

    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const getPreferredLayout = (): ThemeLayout => {
    if (typeof document !== 'undefined') {
        const preset = document.documentElement.getAttribute('data-theme-layout');
        if (preset === 'modern' || preset === 'brutalist') {
            return preset;
        }
    }

    if (typeof window === 'undefined') {
        return 'brutalist';
    }

    const stored = localStorage.getItem(LAYOUT_STORAGE_KEY);
    return stored === 'modern' ? 'modern' : 'brutalist';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<ThemeMode>(() => getPreferredMode());
    const [layout, setLayout] = useState<ThemeLayout>(() => getPreferredLayout());

    useEffect(() => {
        document.documentElement.setAttribute('data-theme-mode', mode);
        localStorage.setItem(MODE_STORAGE_KEY, mode);
    }, [mode]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme-layout', layout);
        localStorage.setItem(LAYOUT_STORAGE_KEY, layout);
    }, [layout]);

    const value = useMemo(
        () => ({
            mode,
            layout,
            setMode,
            setLayout,
            toggleMode: () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark')),
        }),
        [mode, layout]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};
