import React, { memo } from 'react';
import { ThemeLayout, useTheme } from '../theme/ThemeContext';

const layoutLabels: Record<ThemeLayout, string> = {
    brutalist: 'Brutalist',
    modern: 'Modern',
};

const ThemeSettingsComponent: React.FC = () => {
    const { layout, mode, setLayout, setMode } = useTheme();

    return (
        <div className="theme-settings" role="group" aria-label="Appearance settings">
            <label className="theme-settings__group" htmlFor="theme-layout">
                <span className="theme-settings__label">Theme</span>
                <span className="theme-settings__control theme-settings__control--layout">
                    <select
                        id="theme-layout"
                        className="theme-settings__select"
                        value={layout}
                        onChange={(event) => setLayout(event.target.value as ThemeLayout)}
                    >
                        {Object.entries(layoutLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                    <span className="theme-settings__select-icon" aria-hidden="true" />
                </span>
            </label>

            <div className="theme-settings__group" role="group" aria-label="Color mode">
                <span className="theme-settings__label">Mode</span>
                <span className="theme-settings__modes">
                    <button
                        type="button"
                        className={`theme-settings__mode-btn ${mode === 'light' ? 'is-active' : ''}`}
                        aria-pressed={mode === 'light'}
                        onClick={() => setMode('light')}
                    >
                        Light
                    </button>
                    <button
                        type="button"
                        className={`theme-settings__mode-btn ${mode === 'dark' ? 'is-active' : ''}`}
                        aria-pressed={mode === 'dark'}
                        onClick={() => setMode('dark')}
                    >
                        Dark
                    </button>
                </span>
            </div>
        </div>
    );
};

export const ThemeSettings = memo(ThemeSettingsComponent);
ThemeSettings.displayName = 'ThemeSettings';
