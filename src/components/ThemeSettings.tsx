import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ThemeLayout, ThemeMode, useTheme } from '../theme/ThemeContext';

const layoutLabels: Record<ThemeLayout, string> = {
    brutalist: 'Brutalist',
    modern: 'Modern',
};

const ThemeSettingsComponent: React.FC = () => {
    const { layout, mode, setLayout, setMode } = useTheme();
    const [isLayoutMenuOpen, setLayoutMenuOpen] = useState(false);
    const layoutMenuRef = useRef<HTMLSpanElement>(null);

    const closeLayoutMenu = useCallback(() => {
        setLayoutMenuOpen(false);
    }, []);

    const handleLayoutSelect = useCallback(
        (nextLayout: ThemeLayout) => {
            setLayout(nextLayout);
            closeLayoutMenu();
        },
        [closeLayoutMenu, setLayout]
    );

    const handleModeChange = useCallback(
        (nextMode: ThemeMode) => {
            setMode(nextMode);
        },
        [setMode]
    );

    const handleLayoutTriggerKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLButtonElement>) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                setLayoutMenuOpen(true);
            }
        },
        []
    );

    const handleLayoutBlur = useCallback(
        (event: React.FocusEvent<HTMLElement>) => {
            if (layoutMenuRef.current && !layoutMenuRef.current.contains(event.relatedTarget as Node | null)) {
                closeLayoutMenu();
            }
        },
        [closeLayoutMenu]
    );

    useEffect(() => {
        if (!isLayoutMenuOpen) {
            return undefined;
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (layoutMenuRef.current && !layoutMenuRef.current.contains(event.target as Node)) {
                closeLayoutMenu();
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeLayoutMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [closeLayoutMenu, isLayoutMenuOpen]);

    return (
        <div className="theme-settings" aria-label="Appearance settings">
            <label className="theme-settings__group">
                <span className="theme-settings__label">Layout</span>
                <span
                    className="theme-settings__control theme-settings__control--layout"
                    ref={layoutMenuRef}
                    onBlur={handleLayoutBlur}
                >
                    <button
                        type="button"
                        className="theme-settings__select"
                        aria-haspopup="listbox"
                        aria-expanded={isLayoutMenuOpen}
                        aria-controls="layout-menu"
                        onClick={() => setLayoutMenuOpen((open) => !open)}
                        onKeyDown={handleLayoutTriggerKeyDown}
                    >
                        <span className="theme-settings__select-label">{layoutLabels[layout]}</span>
                        <span className="theme-settings__select-icon" aria-hidden="true" />
                    </button>
                    {isLayoutMenuOpen && (
                        <div id="layout-menu" role="listbox" aria-label="Layout options" className="theme-settings__dropdown">
                            {Object.entries(layoutLabels).map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    role="option"
                                    aria-selected={layout === value}
                                    className={`theme-settings__option ${layout === value ? 'is-active' : ''}`}
                                    onClick={() => handleLayoutSelect(value as ThemeLayout)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    )}
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
