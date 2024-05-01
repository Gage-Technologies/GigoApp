import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import Home from './src/pages/home';
import Login from "./src/pages/login";
import { theme } from './src/theme';


const App = () => {
  return (
    <PaperProvider theme={theme}>
          <Login />
        </PaperProvider>
  );
};

export default App;