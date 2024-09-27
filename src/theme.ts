import {DefaultTheme} from 'react-native-paper';

// Define base colors used throughout the theme, matching the dark mode of your web app
const baseColors = {
  primary: '#29C18C', // Green
  primaryVariant: '#1c8762', // Darker Green
  secondary: '#3D8EF7', // Blue
  secondaryVariant: '#2a63ac', // Darker Blue
  tertiary: '#dfce53',
  tertiaryVariant: '#b3a337',
  background: '#1c1c1a', // Very dark grey (almost black)
  surface: '#282826', // Dark grey
  error: '#B00020', // Red
  onPrimary: '#FFFFFF', // White on primary
  onSecondary: '#FFFFFF', // White on secondary
  onBackground: '#FFFFFF', // White on background
  onSurface: '#FFFFFF', // White on surface
  onError: '#FFFFFF', // White on error
  text: '#FFFFFF', // White text
  textSecondary: '#9B9B9B', // Grey text
  disabled: '#9B9B9B', // Grey
  placeholder: '#9B9B9B', // Grey
  backdrop: '#1c1c1a', // Same as background
  notification: '#FFFCAB', // Yellowish
  paper: '#3a3a38',
};

// Define typography based on the Poppins font, mirroring the styles used in your web app
const typography = {
  regular: {
    fontFamily: 'Poppins-Regular',
    fontWeight: 'normal',
  },
  medium: {
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
  },
  light: {
    fontFamily: 'Poppins-Light',
    fontWeight: '300',
  },
  thin: {
    fontFamily: 'Poppins-Thin',
    fontWeight: '100',
  },
};

export const theme = {
  ...DefaultTheme,
  dark: true, // Enable dark mode
  colors: {
    ...DefaultTheme.colors,
    ...baseColors,
  },
  fonts: {
    ...DefaultTheme.fonts,
    ...typography,
  },
  roundness: 10, // Adjust the roundness of components if desired
};
