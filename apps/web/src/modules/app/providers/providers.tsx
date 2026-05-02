'use client';

import type { ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { AppProvider } from '@/modules/app';
import { ThemeProvider } from '@workspace/theme';

function ThemeBridge({ children }: { children: ReactNode }) {
    const { theme, resolvedTheme, setTheme } = useTheme();

    return (
        <ThemeProvider
            defaultColorScheme="bora"
            theme={theme}
            resolvedTheme={resolvedTheme}
            setTheme={setTheme}
        >
            {children}
        </ThemeProvider>
    );
}

export function Providers({ children }: { children: ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
            storageKey="theme"
        >
            <ThemeBridge>
                <AppProvider>{children}</AppProvider>
            </ThemeBridge>
        </NextThemesProvider>
    );
}
