import { useEffect, useState } from 'react';
import type { Theme } from '../lib/utils/theme';
import {
    getActualTheme,
    loadThemeFromStorage,
    applyThemeClass,
} from '../lib/utils/theme';

export function useThemeState(
    resolvedTheme?: string,
    theme?: string,
): Theme {
    const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
        const stored = loadThemeFromStorage();
        if (stored) {
            return stored;
        }
        return getActualTheme(resolvedTheme, theme);
    });

    useEffect(() => {
        const stored = loadThemeFromStorage();
        if (stored) {
            setCurrentTheme(stored);
            applyThemeClass(stored);
        } else {
            const actualTheme = getActualTheme(resolvedTheme, theme);
            setCurrentTheme(actualTheme);
        }
    }, []);

    useEffect(() => {
        const actualTheme = getActualTheme(resolvedTheme, theme);
        setCurrentTheme(actualTheme);
    }, [resolvedTheme, theme]);

    useEffect(() => {
        const updateTheme = () => {
            const actualTheme = getActualTheme(resolvedTheme, theme);
            setCurrentTheme(prev =>
                prev !== actualTheme ? actualTheme : prev,
            );
        };

        const observer = new MutationObserver(() => {
            requestAnimationFrame(updateTheme);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => {
            observer.disconnect();
        };
    }, [resolvedTheme, theme]);

    return currentTheme;
}
