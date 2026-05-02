import type { ColorScheme } from '../types/theme';

export interface ColorSchemeOption {
    value: ColorScheme;
    color: string;
}

export const COLOR_SCHEME_OPTIONS: ColorSchemeOption[] = [
    { value: 'default', color: '#1E293B' },
    { value: 'blue', color: '#3B82F6' },
    { value: 'violet', color: '#8B5CF6' },
    { value: 'pink', color: '#EC4899' },
    { value: 'red', color: '#EF4444' },
    { value: 'orange', color: '#F97316' },
    { value: 'yellow', color: '#FACC15' },
    { value: 'green', color: '#22C55E' },
    { value: 'bx', color: '#30c3ef' },
    { value: 'beige', color: '#F5F3F0' },
    { value: 'explosive-pink', color: '#bb52d4' },
    { value: 'bora', color: '#F44848' },
];
