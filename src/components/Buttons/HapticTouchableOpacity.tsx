import React from 'react';
import {
  GestureResponderEvent,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useSelector} from 'react-redux';
import {selectHapticStrength} from '../../reducers/appSettings';

/**
 * haptic touchable opacity component
 * wraps touchableopacity with haptic feedback on press
 * @param props - standard touchableopacity props
 * @returns touchableopacity component with haptic feedback
 */
const HapticTouchableOpacity: React.FC<TouchableOpacityProps> = props => {
  // get haptic strength from redux
  const hapticStrength = useSelector(selectHapticStrength);

  // function to handle press with haptic feedback
  const handlePress = (event: GestureResponderEvent) => {
    // trigger haptic feedback
    ReactNativeHapticFeedback.trigger(hapticStrength, {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });

    // call the original onPress if it exists
    if (props.onPress) {
      props.onPress(event);
    }
  };

  // return touchableopacity with modified onPress
  return <TouchableOpacity {...props} onPress={handlePress} />;
};

export default HapticTouchableOpacity;
