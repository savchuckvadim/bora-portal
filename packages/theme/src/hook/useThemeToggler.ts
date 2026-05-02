import { useState, useEffect } from 'react';
import { useTheme } from './useTheme';
import { useColorScheme } from './useColorScheme';
import { useMounted } from './useMounted';
import { useThemeState } from './useThemeState';
import {
    toggleTheme,
    applyThemeAndColorScheme,
    saveThemeToStorage,
} from '../lib/utils/theme';

export function useThemeToggler() {
    const { theme, resolvedTheme, setTheme } = useTheme();
    const { scheme } = useColorScheme();
    const mounted = useMounted();
    const currentTheme = useThemeState(resolvedTheme, theme);
    const [isSpinning, setIsSpinning] = useState(false);

    useEffect(() => {
        if (mounted) {
            setIsSpinning(true);
            const timer = setTimeout(() => {
                setIsSpinning(false);
            }, 400);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [currentTheme, mounted]);

    const toggle = () => {
        if (!mounted) return;

        const newTheme = toggleTheme(currentTheme);

        saveThemeToStorage(newTheme);
        setTheme(newTheme);
        applyThemeAndColorScheme(scheme, newTheme);
    };

    return {
        currentTheme,
        toggle,
        mounted,
        isSpinning,
    };
}
