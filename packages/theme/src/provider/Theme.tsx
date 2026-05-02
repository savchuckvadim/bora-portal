'use client';

import React, { createContext } from 'react';
import { useTheme as useNextTheme } from 'next-themes';
import { useColorSchemeState } from '../hook/useColorSchemeState';
import { useApplyColorScheme } from '../hook/useApplyColorScheme';
import type {
    ColorScheme,
    ColorContextValue,
    ThemeContextValue,
} from '../lib/types/theme';
import { ColorSchemes } from '../lib/types/theme';

export type {
    ColorScheme,
    ColorContextValue,
    ThemeContextValue,
} from '../lib/types/theme';
export { ColorSchemes };

export const ColorContext = createContext<ColorContextValue | null>(null);
export const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
    children: React.ReactNode;
    /** Палитра до первого выбора пользователя и если в localStorage нет `color-scheme`. */
    defaultColorScheme?: ColorScheme;
    theme?: string | undefined;
    resolvedTheme?: string | undefined;
    setTheme?: (theme: string) => void;
}

/**
 * Цветовые схемы (default, bora, …) + интеграция с next-themes (light / dark / system).
 */
export function ThemeProvider({
    children,
    defaultColorScheme = 'default',
    theme: themeProp,
    resolvedTheme: resolvedThemeProp,
    setTheme: setThemeProp,
}: ThemeProviderProps) {
    const [scheme, setScheme] = useColorSchemeState(defaultColorScheme);
    const nextTheme = useNextTheme();
    const theme = themeProp ?? nextTheme.theme;
    const resolvedTheme = resolvedThemeProp ?? nextTheme.resolvedTheme;
    const setTheme = setThemeProp ?? nextTheme.setTheme;

    useApplyColorScheme(scheme, resolvedTheme, theme);

    return (
        <ColorContext.Provider value={{ scheme, setScheme }}>
            <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
                {children}
            </ThemeContext.Provider>
        </ColorContext.Provider>
    );
}
