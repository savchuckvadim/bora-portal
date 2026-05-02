import { useState, useEffect } from 'react';
import { useMounted } from './useMounted';
import { loadColorSchemeFromStorage } from '../lib/utils/theme';
import type { ColorScheme } from '../lib/types/theme';

export function useColorSchemeState(defaultScheme: ColorScheme = 'default') {
    const [scheme, setScheme] = useState<ColorScheme>(defaultScheme);
    const mounted = useMounted();

    useEffect(() => {
        if (!mounted) return;
        const stored = loadColorSchemeFromStorage();
        if (stored) {
            setScheme(stored);
        }
    }, [mounted]);

    return [scheme, setScheme] as const;
}
