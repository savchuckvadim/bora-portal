import { ColorContext } from '../provider/Theme';
import { useContext } from 'react';

export function useColorScheme() {
    const ctx = useContext(ColorContext);
    if (!ctx) {
        throw new Error('useColorScheme must be used within ThemeProvider');
    }
    return ctx;
}
