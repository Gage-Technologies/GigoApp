import React from 'react';
import AwesomeButton from 'react-native-really-awesome-button';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {ButtonTypes} from 'react-native-really-awesome-button/lib/typescript/src/Button';
import {useSelector} from 'react-redux';
import {selectHapticStrength} from '../../reducers/appSettings';

/**
 * haptic awesome button component
 * wraps awesomebutton with haptic feedback on press
 * @param props - standard awesomebutton props
 * @returns awesomebutton component with haptic feedback
 */
const HapticAwesomeButton: React.FC<ButtonTypes> = props => {
  // get haptic strength from redux
  const hapticStrength = useSelector(selectHapticStrength);

  // function to handle press with haptic feedback
  const handlePress = () => {
    // trigger haptic feedback
    ReactNativeHapticFeedback.trigger(hapticStrength, {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });

    // call the original onPress if it exists
    if (props.onPress) {
      props.onPress();
    }
  };

  // return awesomebutton with modified onPress
  return <AwesomeButton {...props} onPress={handlePress} />;
};

export default HapticAwesomeButton;
