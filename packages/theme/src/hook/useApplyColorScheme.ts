import { useEffect } from 'react';
import { useMounted } from './useMounted';
import {
    getActualTheme,
    applyColorSchemeClass,
    saveColorSchemeToStorage,
} from '../lib/utils/theme';
import type { ColorScheme } from '../lib/types/theme';

export function useApplyColorScheme(
    scheme: ColorScheme,
    resolvedTheme?: string,
    theme?: string,
) {
    const mounted = useMounted();

    useEffect(() => {
        if (!mounted) return;

        const actualTheme = getActualTheme(resolvedTheme, theme);
        applyColorSchemeClass(scheme, actualTheme);
        saveColorSchemeToStorage(scheme);
    }, [scheme, theme, resolvedTheme, mounted]);
}
