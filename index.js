/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import messaging from '@react-native-firebase/messaging';

const GOOGLE_ANDROID_CLIENT_ID = Config.GOOGLE_ANDROID_CLIENT_ID;
const GOOGLE_WEB_CLIENT_ID = Config.GOOGLE_WEB_CLIENT_ID;

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
GoogleSignin.configure({
  androidClientId: GOOGLE_ANDROID_CLIENT_ID,
  webClientId: GOOGLE_WEB_CLIENT_ID,
});
