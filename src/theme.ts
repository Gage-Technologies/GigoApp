// theme.ts
import { DefaultTheme } from 'react-native-paper';

const createFontFamily = (fontFamily: string) => ({
    regular: {
        fontFamily: fontFamily,
        fontWeight: 'normal',
    },
    medium: {
        fontFamily: fontFamily,
        fontWeight: '500',
    },
    light: {
        fontFamily: fontFamily,
        fontWeight: '300',
    },
    thin: {
        fontFamily: fontFamily,
        fontWeight: '100',
    },
});

const baseColors = {
    primary: '#29C18C',
    primaryVariant: '#1c8762',
    secondary: '#3D8EF7',
    secondaryVariant: '#2a63ac',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    error: '#B00020',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#1c1c1a',
    onSurface: '#1c1c1a',
    onError: '#FFFFFF',
    text: '#1c1c1a',
    disabled: '#9B9B9B',
    placeholder: '#9B9B9B',
    backdrop: '#1c1c1a',
    notification: '#FFFCAB',
};

export const theme: typeof DefaultTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: baseColors.primary,
        accent: baseColors.secondary,
        background: baseColors.background,
        surface: baseColors.surface,
        error: baseColors.error,
        text: baseColors.text,
        onBackground: baseColors.onBackground,
        onSurface: baseColors.onSurface,
        disabled: baseColors.disabled,
        placeholder: baseColors.placeholder,
        backdrop: baseColors.backdrop,
        notification: baseColors.notification,
    },
    fonts: createFontFamily("Poppins"),
    roundness: 10,
};

theme.fonts = {
    ...theme.fonts,
    regular: {
        ...theme.fonts.regular,
        fontFamily: 'Poppins',
        fontWeight: 'normal',
    },
    medium: {
        ...theme.fonts.medium,
        fontFamily: 'Poppins',
        fontWeight: '500',
    },
    light: {
        ...theme.fonts.light,
        fontFamily: 'Poppins',
        fontWeight: '300',
    },
    thin: {
        ...theme.fonts.thin,
        fontFamily: 'Poppins',
        fontWeight: '100',
    },
};