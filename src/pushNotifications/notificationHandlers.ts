import messaging from '@react-native-firebase/messaging';

export const listenToForegroundNotifications = () => {
  return messaging().onMessage(async remoteMessage => {
    console.log('A new message arrived! (FOREGROUND)', JSON.stringify(remoteMessage));
    // Handle the message as needed
  });
};

export const listenToBackgroundNotifications = () => {
  return messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('A new message arrived! (BACKGROUND)', JSON.stringify(remoteMessage));
    // Handle the message as needed
  });
};

export const onNotificationOpenedAppFromBackground = () => {
  return messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('App opened from BACKGROUND by tapping notification:', JSON.stringify(remoteMessage));
    // Handle the message as needed
  });
};

export const onNotificationOpenedAppFromQuit = async () => {
  const message = await messaging().getInitialNotification();
  if (message) {
    console.log('App opened from QUIT by tapping notification:', JSON.stringify(message));
    // Handle the message as needed
  }
};
