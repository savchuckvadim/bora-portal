import type { ColorScheme } from '../types/theme';
import { ColorSchemes } from '../types/theme';

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme';
const COLOR_SCHEME_STORAGE_KEY = 'color-scheme';

/**
 * Текущая light/dark: сначала класс на html, затем next-themes.
 */
export function getActualTheme(resolvedTheme?: string, theme?: string): Theme {
    if (typeof document !== 'undefined') {
        if (document.documentElement.classList.contains('dark')) {
            return 'dark';
        }
        if (document.documentElement.classList.contains('light')) {
            return 'light';
        }
    }

    if (resolvedTheme === 'dark' || resolvedTheme === 'light') {
        return resolvedTheme;
    }

    if (
        theme &&
        theme !== 'system' &&
        (theme === 'dark' || theme === 'light')
    ) {
        return theme;
    }

    return 'light';
}

export function getColorSchemeClassName(
    scheme: ColorScheme,
    theme: Theme,
): string {
    return `${scheme}-${theme}`;
}

export function removeColorSchemeClasses(): void {
    if (typeof document === 'undefined') return;

    document.documentElement.classList.remove(
        ...ColorSchemes.flatMap(s => [`${s}-light`, `${s}-dark`]),
    );
}

export function applyColorSchemeClass(scheme: ColorScheme, theme: Theme): void {
    if (typeof document === 'undefined') return;

    removeColorSchemeClasses();
    document.documentElement.classList.add(
        getColorSchemeClassName(scheme, theme),
    );
}

export function applyThemeClass(theme: Theme): void {
    if (typeof document === 'undefined') return;

    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
}

export function applyThemeAndColorScheme(
    scheme: ColorScheme,
    theme: Theme,
): void {
    applyThemeClass(theme);
    applyColorSchemeClass(scheme, theme);
}

export function saveThemeToStorage(theme: Theme): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function loadThemeFromStorage(): Theme | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
        return stored;
    }
    return null;
}

export function saveColorSchemeToStorage(scheme: ColorScheme): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, scheme);
}

export function loadColorSchemeFromStorage(): ColorScheme | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
    if (stored && ColorSchemes.includes(stored as ColorScheme)) {
        return stored as ColorScheme;
    }
    return null;
}

export function isDarkTheme(theme: Theme | string | undefined): boolean {
    return theme === 'dark';
}

export function toggleTheme(currentTheme: Theme): Theme {
    return currentTheme === 'dark' ? 'light' : 'dark';
}
