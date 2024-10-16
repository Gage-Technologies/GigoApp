/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as ReduxProvider} from 'react-redux';
import store from './src/reducers/store';
import {theme} from './src/theme';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AppRouter from './src/router';
import {LanguageProvider} from './src/LanguageContext';

import {Alert, PermissionsAndroid, Platform, Linking} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import AppLaunch from './src/components/AppLaunch';
import BootSplash from 'react-native-bootsplash';

import InAppPurchases from './src/services/InAppPurchase';
import SplashScreen from './src/components/SplashScreen';

const persistor = persistStore(store);

const App = () => {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

  const [splashScreenVisible, setSplashScreenVisible] = useState(true);

  useEffect(() => {
    // Create a notification channel
    const createNotificationChannel = async () => {
      await notifee.createChannel({
        id: 'gigoApp',
        name: 'GIGO Dev',
        importance: AndroidImportance.HIGH,
      });
    };

    createNotificationChannel();

    // Handle foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);

      // Display a styled notification with an image using notifee
      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'Default Title',
        body: remoteMessage.notification?.body || 'Default Message',
        android: {
          channelId: 'gigoApp',
          smallIcon: 'ic_notification', // Ensure you have this icon in your resources
          color: '#176e51',
          importance: AndroidImportance.HIGH,
        },
      });
    });

    return unsubscribe;
  }, []);
  
  useEffect(() => {
    InAppPurchases.init();
    InAppPurchases.setupListeners();

    return () => {
      InAppPurchases.removeListeners();
    };
  }, []);

  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <GestureHandlerRootView style={{flex: 1}}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PaperProvider theme={theme}>
            <LanguageProvider>
              <AppLaunch>
                {splashScreenVisible ? (
                  <SplashScreen
                    onAnimationEnd={() => setSplashScreenVisible(false)}
                  />
                ) : (
                  <AppRouter />
                )}
              </AppLaunch>
            </LanguageProvider>
          </PaperProvider>
        </PersistGate>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
};

export default App;
