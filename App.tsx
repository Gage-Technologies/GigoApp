import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as ReduxProvider } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import store from './src/reducers/store';
import Home from './src/pages/home';
import Login from './src/pages/login';
import ForgotPassword from './src/pages/forgotPassword';
import CreateNewAccount from './src/pages/createNewAccount';
import JourneyMain from './src/pages/journeyMain';
import SpeedDial from './src/components/SpeedDial';
import { theme } from './src/theme';
import BottomBar from './src/components/BottomBar';
import { GoogleOAuthProvider } from '@react-oauth/google';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <View style={styles.container}>
            <Stack.Navigator>
              <Stack.Screen
                name="JourneyMain"
                component={JourneyMain}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SignUp"
                component={CreateNewAccount}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
            <SpeedDial />
          </View>
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
