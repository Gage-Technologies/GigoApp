import React, {useEffect, useRef} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {
  NavigationContainer,
  NavigationContainerRef, useNavigationState, useRoute
} from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider as ReduxProvider} from 'react-redux';
import {View, StyleSheet} from 'react-native';
import store from './src/reducers/store';
import Home from './src/pages/home';
import Login from './src/pages/login';
import ForgotPassword from './src/pages/forgotPassword';
import CreateNewAccount from './src/pages/createNewAccount';
import AccountSettings from './src/pages/accountSettings';
import JourneyMain from './src/pages/journeyMain';
import Profile from './src/pages/profile';
import Byte from './src/pages/byte';
import SpeedDial from './src/components/SpeedDial';
import {theme} from './src/theme';
import {handleDeepLink} from './deepLinking.tsx';

const Stack = createNativeStackNavigator();

const App = () => {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  useEffect(() => {
    console.log('app page about to call deep link');
    handleDeepLink(navigationRef);
    getCurrentRouteName()
    return () => {
      //             Linking.removeEventListener('url');
    };
  }, []);

  const getCurrentRouteName = () => {
    const state = navigationRef.current?.getRootState();
    console.log("state is: ", state)
    console.log("info is: ", state?.routes[state.index]?.name)
    setCurrentRouteName(state?.routes[state.index]?.name)
  };

  const [currentRouteName, setCurrentRouteName] = React.useState('');
  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer
          ref={navigationRef}
          onStateChange={() => getCurrentRouteName()}
        >
          <View style={styles.container}>
            <Stack.Navigator>
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
                name="Byte"
                component={Byte}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="AccountSettings"
                component={AccountSettings}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Profile"
                component={Profile}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Home"
                component={Home}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="JourneyMain"
                component={JourneyMain}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{headerShown: false}}
              />
            </Stack.Navigator>
            <ConditionalSpeedDial currentRouteName={currentRouteName}/>
          </View>
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
};

const ConditionalSpeedDial = ({ currentRouteName }) => {
  console.log("current route: ", currentRouteName)
  if (currentRouteName === 'Login' || currentRouteName === 'SignUp' || currentRouteName === 'ForgotPassword') {
    return null;
  }

  return <SpeedDial />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
