import { useContext } from 'react';
import { ThemeContext } from '../provider/Theme';

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error(
            'useTheme must be used within ThemeProvider (inside NextThemesProvider)',
        );
    }
    return ctx;
}
