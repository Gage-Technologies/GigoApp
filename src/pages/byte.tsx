/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View} from 'react-native';
import {WebView} from 'react-native-webview';
import {useSelector} from 'react-redux';
import {selectAuthState} from '../reducers/auth';
import {useNavigation} from '@react-navigation/native';
import XpPopup from '../components/XpPopup';

// component to display a byte or journey in a webview
const Byte: React.FC<{
  route: {params: {byteId: string; isJourney: boolean}};
}> = ({route}) => {
  let {byteId, isJourney} = route.params;

  const authState = useSelector(selectAuthState);

  const navigation = useNavigation();
  const [showXpPopup, setShowXpPopup] = useState(false);
  const [xpData, setXpData] = useState({
    oldXP: 0,
    newXP: 0,
    nextLevel: 1,
    maxXP: 100,
    levelUp: false,
    gainedXP: 0,
    renown: 0,
  });

  console.log('authState', authState);

  console.log(
    'target',
    `https://www.gigo.dev/byte/${byteId}?embed=true&viewport=mobile&appToken=${
      authState.token
    }${isJourney ? '&journey=true' : ''}`,
  );

  const handleXpGain = (gainedXp: number) => {
    // TODO: Figure out how to handle all of this xp data
    const currentXP = 50;
    const currentLevel = 1;
    const xpForNextLevel = 100;

    const newXP = currentXP + gainedXp;
    const levelUp = newXP >= xpForNextLevel;
    const nextLevel = levelUp ? currentLevel + 1 : currentLevel;

    setXpData({
      oldXP: currentXP,
      newXP: newXP,
      nextLevel: nextLevel,
      maxXP: xpForNextLevel,
      levelUp: levelUp,
      gainedXP: gainedXp,
      renown: 0,
    });

    setShowXpPopup(true);
  };

  const handleCloseXpPopup = () => {
    setShowXpPopup(false);
  };

  // function to handle url changes
  const handleNavigationStateChange = (newNavState: any): boolean => {
    console.log('newNavState', newNavState);
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

    // Check for XP gain events here
    // This is a placeholder condition. Replace with actual logic to detect XP gain.
    if (newNavState.url.includes('xp_gained')) {
      const xpGained = 50; // Replace with actual XP gained
      handleXpGain(xpGained);
    }

    return true;
  };

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
      }}>
      <WebView
        source={{
          uri: `https://www.gigo.dev/byte/${byteId}?embed=true&viewport=mobile&appToken=${
            authState.token
          }${isJourney ? '&journey=true' : ''}`,
        }}
        onNavigationStateChange={handleNavigationStateChange}
      />
      {showXpPopup && (
        <XpPopup {...xpData} popupClose={handleCloseXpPopup} homePage={false} />
      )}
    </View>
  );
};

export default Byte;
