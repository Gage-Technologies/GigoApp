/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
} from 'react-native';
import {WebView} from 'react-native-webview';
import { useSelector } from 'react-redux';
import { selectAuthState } from '../reducers/auth';
import { useNavigation } from '@react-navigation/native';

// component to display a byte or journey in a webview
const Byte: React.FC<{ route: { params: { byteId: string, isJourney: boolean } } }> = ({ route }) => {
  let { byteId, isJourney } = route.params;

  const authState = useSelector(selectAuthState);

  const navigation = useNavigation();

  console.log("authState", authState);

  console.log("target", `https://www.gigo.dev/byte/${byteId}?embed=true&viewport=mobile&appToken=${authState.token}${isJourney ? '&journey=true' : ''}`);

  // function to handle url changes
  const handleNavigationStateChange = (newNavState: any): boolean => {
    console.log("newNavState", newNavState);
    // parse the url manually since url.pathname is not implemented in hermes
    const urlParts = newNavState.url.split('/');
    const queryParts = urlParts[urlParts.length - 1].split('?');
    const pathParts = urlParts.slice(2, -1).concat(queryParts[0]);

    // check if the path is /journey
    if (pathParts[1] === 'journey') {
      // navigate to the journey page
      // @ts-ignore
      navigation.navigate('JourneyMain');
      // return false to prevent default navigation
      return false;
    }
    
    // update byteId if it has changed
    if (pathParts[2] && pathParts[2] !== byteId) {
      byteId = pathParts[2];
    }
    
    // update isJourney based on url parameters
    isJourney = newNavState.url.includes('journey=true');
    return true;
  };

  return (
    <View style={{
      width: '100%',
      height: '100%',
    }}>
      <WebView 
        source={{uri: `https://www.gigo.dev/byte/${byteId}?embed=true&viewport=mobile&appToken=${authState.token}${isJourney ? '&journey=true' : ''}`}}
        onNavigationStateChange={handleNavigationStateChange}
      />
    </View>
  );
}

export default Byte;
