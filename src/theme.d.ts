import 'react-native-paper';

// extend the theme interface to include custom fonts
declare module 'react-native-paper' {
  interface ThemeFonts {
    regular: {
      fontFamily: string;
      fontWeight: string;
    };
    medium: {
      fontFamily: string;
      fontWeight: string;
    };
    light: {
      fontFamily: string;
      fontWeight: string;
    };
    thin: {
      fontFamily: string;
      fontWeight: string;
    };
  }

  interface Theme {
    fonts: ThemeFonts;
  }
}
