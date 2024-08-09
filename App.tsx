/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as ReduxProvider} from 'react-redux';
import store from './src/reducers/store';
import {theme} from './src/theme';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AppRouter from './src/router';
import {LanguageProvider} from './src/LanguageContext';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import premiumGorilla from './src/img/premiumGorilla.png'

const persistor = persistStore(store);

const App = () => {
  // const requestNotificationPermission = async () => {
  //   if (Platform.OS === 'android' && Platform.Version >= 33) {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  //       );
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         console.log('Notification permission granted.');
  //       } else {
  //         console.log('Notification permission denied.');
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   }
  // };

  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

  //   const getFcmToken = async () => {
  //     const fcmToken = await messaging().getToken();
  //     if (fcmToken) {
  //       console.log('FCM Token:', fcmToken);
  //       Alert.alert('FCM Token', fcmToken); // Display the token for testing purposes
  //       // Save the token to your backend if needed
  //     } else {
  //       console.log('Failed to get FCM token');
  //     }
  //   };

  // const setupFirebase = async () => {
  //   await requestNotificationPermission();
  //
  //   //     // Retrieve the FCM token
  //   //     await getFcmToken();
  //
  //   // Handle foreground messages
  //   messaging().onMessage(async remoteMessage => {
  //     Alert.alert(
  //       JSON.stringify(remoteMessage.notification.title),
  //       JSON.stringify(remoteMessage.notification.body),
  //     );
  //   });
  // };
  //
  // useEffect(() => {
  //   setupFirebase();
  // }, []);

  useEffect(() => {
    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   Alert.alert(
    //     remoteMessage.notification.title,
    //     remoteMessage.notification.body,
    //   );
    // });

    // Create a notification channel
    const createNotificationChannel = async () => {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
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
          channelId: 'gigo_logo_email_cropped',
          smallIcon: premiumGorilla, // Ensure you have this icon in your resources
          color: remoteMessage.notification?.android?.color || '#4caf50',
          importance: AndroidImportance.HIGH,
          // largeIcon: 'https://yourdomain.com/your-large-icon.png', // URL to a large icon
          // style: {
          //   type: 'bigPicture',
          //   picture: remoteMessage.notification?.image, // Image URL from the payload
          // },
        },
      });
    });

    return unsubscribe;
  }, []);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PaperProvider theme={theme}>
            <LanguageProvider>
              <AppRouter />
            </LanguageProvider>
          </PaperProvider>
        </PersistGate>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
};

export default App;
