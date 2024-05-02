import { DefaultTheme } from 'react-native-paper';

// Define base colors used throughout the theme
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

const typography = {
    h1: {
        fontFamily: 'Poppins-Medium',
        fontWeight: '600',
        fontSize: 72,
        lineHeight: 95,
    },
};

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        ...baseColors,
    },
    fonts: {
        ...DefaultTheme.fonts,
        ...typography,
    },
    roundness: 10,
};
