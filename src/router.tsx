import React, {useEffect, useRef} from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View, StyleSheet} from 'react-native';
import Login from './pages/login';
import ForgotPassword from './pages/forgotPassword';
import CreateNewAccount from './pages/createNewAccount';
import AccountSettings from './pages/accountSettings';
import JourneyMain from './pages/journeyMain';
import Byte from './pages/byte';
import Detour from './pages/detour.tsx';
import Stats from './pages/stats.tsx';
import AboutJourney from './pages/aboutJourney.tsx';
import SpeedDial from './components/SpeedDial';
import BottomBar from './components/BottomBar';
import TopBar from './components/TopBar'; // new import
import {selectAuthState} from './reducers/auth.ts';
import {handleDeepLink} from './deepLinking.tsx';
import {useSelector} from 'react-redux';

const Stack = createNativeStackNavigator();

const AppRouter = () => {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const authState = useSelector(selectAuthState);

  useEffect(() => {
    if (!authState.authenticated) {
      navigationRef.current?.navigate('Login');
    }

    console.log('app page about to call deep link');
    handleDeepLink(navigationRef);
    getCurrentRouteName();
    return () => {
      //             Linking.removeEventListener('url');
    };
  }, []);

  const getCurrentRouteName = () => {
    const state = navigationRef.current?.getRootState();
    console.log('state is: ', state);
    console.log('info is: ', state?.routes[state.index]?.name);
    // @ts-ignore
    setCurrentRouteName(state?.routes[state.index]?.name);
  };

  const [currentRouteName, setCurrentRouteName] = React.useState('');

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={() => getCurrentRouteName()}>
      <View style={styles.container}>
        <ConditionalTopBar currentRouteName={currentRouteName} />
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AccountSettings"
            component={AccountSettings}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="JourneyMain"
            component={JourneyMain}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AboutJourney"
            component={AboutJourney}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Stats"
            component={Stats}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignUp"
            component={CreateNewAccount}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Detour"
            component={Detour}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Byte"
            // @ts-ignore
            component={Byte}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
        <ConditionalBottomBar currentRouteName={currentRouteName} />
      </View>
    </NavigationContainer>
  );
};

const ConditionalTopBar = ({currentRouteName}: {currentRouteName: string}) => {
  if (
    currentRouteName === 'Login' ||
    currentRouteName === 'SignUp' ||
    currentRouteName === 'ForgotPassword' ||
    currentRouteName === 'Byte'
  ) {
    return null;
  }

  // show topbar on all other pages
  return <TopBar />;
};

const ConditionalBottomBar = ({
  currentRouteName,
}: {
  currentRouteName: string;
}) => {
  console.log('current route: ', currentRouteName);
  if (
    currentRouteName === 'Login' ||
    currentRouteName === 'SignUp' ||
    currentRouteName === 'ForgotPassword'
  ) {
    return null;
  }

  // use speeddial for byte page
  if (currentRouteName === 'Byte') {
    return <SpeedDial />;
  }

  // use bottom bar for all other pages
  return <BottomBar />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppRouter;
