import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import Home from './src/pages/home';
import { theme } from './src/theme';


const App = () => {
  return (
    <PaperProvider theme={theme}>
          <Home />
        </PaperProvider>
  );
};

export default App;