import React, {useEffect, useRef} from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {View, StyleSheet} from 'react-native';
import Login from './pages/login';
import ForgotPassword from './pages/forgotPassword';
import CreateNewAccount from './pages/createNewAccount';
import AccountSettings from './pages/accountSettings';
import JourneyMain from './pages/journeyMain';
import Byte from './pages/byte';
import Detour from './pages/detour.tsx';
import QuizPage from './pages/quiz';
import Stats from './pages/stats.tsx';
import AboutJourney from './pages/aboutJourney.tsx';
import SpeedDial from './components/SpeedDial';
import BottomBar from './components/BottomBar';
import TopBar from './components/TopBar'; // new import
import {selectAuthState} from './reducers/auth.ts';
import {handleDeepLink} from './deepLinking.tsx';
import {useSelector} from 'react-redux';
import {selectBottomBarVisible} from './reducers/appSettings.ts';
import Intro from './pages/intro.tsx';

const Stack = createStackNavigator();

const AppRouter = () => {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const authState = useSelector(selectAuthState);

  useEffect(() => {
    handleDeepLink(navigationRef);
    getCurrentRouteName();
  }, []);

  const getCurrentRouteName = () => {
    const state = navigationRef.current?.getRootState();
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
        <Stack.Navigator
          initialRouteName={authState.authenticated ? 'JourneyMain' : 'Intro'}
          screenOptions={{
            headerShown: false,
            cardStyle: {backgroundColor: '#1c1c1a'},
          }}>
          <Stack.Screen name="Intro" component={Intro} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={CreateNewAccount} />
          <Stack.Screen name="AccountSettings" component={AccountSettings} />
          <Stack.Screen name="JourneyMain" component={JourneyMain} />
          <Stack.Screen name="AboutJourney" component={AboutJourney} />
          <Stack.Screen name="Stats" component={Stats} />
          <Stack.Screen name="Detour" component={Detour} />
          <Stack.Screen name="Byte" component={Byte} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Quiz" component={QuizPage} />
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
    currentRouteName === 'Byte' ||
    currentRouteName === 'Intro'
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
  const bottomBarVisible = useSelector(selectBottomBarVisible);

  if (
    currentRouteName === 'Login' ||
    currentRouteName === 'SignUp' ||
    currentRouteName === 'ForgotPassword' ||
    currentRouteName === 'Byte' ||
    currentRouteName === 'Intro' ||
    !bottomBarVisible
  ) {
    return null;
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
