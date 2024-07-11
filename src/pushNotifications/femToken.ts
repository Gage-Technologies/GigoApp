// @ts-ignore
import messaging from '@react-native-firebase/messaging';

export const getFCMToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log('Your Firebase Token is:', fcmToken);
    // Save the token to your server or local storage if needed
  } else {
    console.log('Failed', 'No token received');
  }
};
