import React, { memo, useCallback } from 'react';
import { ThemeLayout, ThemeMode, useTheme } from '../theme/ThemeContext';

const layoutLabels: Record<ThemeLayout, string> = {
    brutalist: 'Brutalist',
    modern: 'Modern',
};

const ThemeSettingsComponent: React.FC = () => {
    const { layout, mode, setLayout, setMode } = useTheme();

    const handleLayoutChange = useCallback(
        (event: React.ChangeEvent<HTMLSelectElement>) => {
            setLayout(event.target.value as ThemeLayout);
        },
        [setLayout]
    );

    const handleModeChange = useCallback(
        (nextMode: ThemeMode) => {
            setMode(nextMode);
        },
        [setMode]
    );

    return (
        <div className="theme-settings" aria-label="Appearance settings">
            <label className="theme-settings__group">
                <span className="theme-settings__label">Layout</span>
                <span className="theme-settings__control">
                    <select className="theme-settings__select" value={layout} onChange={handleLayoutChange}>
                        {Object.entries(layoutLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </span>
            </label>

            <div className="theme-settings__group" role="group" aria-label="Color mode">
                <span className="theme-settings__label">Mode</span>
                <span className="theme-settings__modes">
                    <button
                        type="button"
                        className={`theme-settings__mode-btn ${mode === 'light' ? 'is-active' : ''}`}
                        onClick={() => handleModeChange('light')}
                    >
                        Light
                    </button>
                    <button
                        type="button"
                        className={`theme-settings__mode-btn ${mode === 'dark' ? 'is-active' : ''}`}
                        onClick={() => handleModeChange('dark')}
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
