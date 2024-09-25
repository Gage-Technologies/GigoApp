import React, {ReactNode, useEffect, useRef} from 'react';
import {AppState, AppStateStatus, View} from 'react-native';
import {refreshToken} from '../utils/refreshToken';
import {useDispatch} from 'react-redux';

const AppLaunch = ({children}: {children: ReactNode}) => {
  const appState = useRef(AppState.currentState);
  const dispatch = useDispatch();

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // app has come to the foreground
      onAppOpen();
    }
    appState.current = nextAppState;
  };

  const onAppOpen = () => {
    refreshToken(dispatch);
  };

  // return the view containing the child components
  return children;
};

export default AppLaunch;
