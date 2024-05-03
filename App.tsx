import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import Home from './src/pages/home';
import Login from "./src/pages/login";
import ForgotPassword from "./src/pages/forgotPassword.tsx"
import CreateNewAccount from "./src/pages/createNewAccount"
import { theme } from './src/theme';
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator();


const App = () => {
  return (
    <PaperProvider theme={theme}>
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPassword}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="SignUp"
                    component={CreateNewAccount}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPassword}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="home"
                    component={Home}
                />
            </Stack.Navigator>
        </NavigationContainer>
    </PaperProvider>
  );
};

export default App;