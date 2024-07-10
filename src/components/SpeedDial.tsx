import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Portal, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// define the speeddialoption type for better type checking
type SpeedDialOption = {
  icon: string;
  label: string;
  screen: string;
  color: string;
};

const SpeedDial = () => {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const theme = useTheme();

  // define speed dial options
  const options: SpeedDialOption[] = [
    { icon: 'map', label: 'Journey', screen: 'JourneyMain', color: theme.colors.primary },
    { icon: 'cog', label: 'Settings', screen: 'AccountSettings', color: theme.colors.secondary },
  ];

  // create shared values for animations
  const animation = useSharedValue(0);
  const rotation = useSharedValue(0);

  // handle opening and closing of the speed dial
  const toggleSpeedDial = () => {
    setOpen(!open);
    animation.value = withSpring(open ? 0 : 1);
    rotation.value = withTiming(open ? 0 : 1, { duration: 300 });
  };

  // navigate to the selected screen
  const navigateTo = (screen: string) => {
    toggleSpeedDial();
    // @ts-ignore
    navigation.navigate(screen);
  };

  // create animated styles for the main fab button
  const mainButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${interpolate(rotation.value, [0, 1], [0, 45])}deg` },
      ],
    };
  });

  return (
    <Portal>
      <View style={styles.container}>
        {options.map((option, index) => (
          <Animated.View
            key={option.screen}
            style={[
              styles.optionContainer,
              useAnimatedStyle(() => ({
                opacity: interpolate(animation.value, [0, 1], [0, 1]),
                transform: [
                  { scale: interpolate(animation.value, [0, 1], [0.8, 1]) },
                  { translateY: interpolate(animation.value, [0, 1], [20, -105 - 105 * index]) },
                ],
              })),
            ]}
          >
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: option.color }]}
              onPress={() => navigateTo(option.screen)}
            >
              <Icon name={option.icon} size={24} color="white" />
            </TouchableOpacity>
            <Animated.Text style={[styles.optionLabel, { opacity: animation }]}>
              {option.label}
            </Animated.Text>
          </Animated.View>
        ))}
        <TouchableOpacity
          style={[styles.mainButton, { backgroundColor: theme.colors.primary }]}
          onPress={toggleSpeedDial}
        >
          <Animated.View style={mainButtonStyle}>
            <Icon name="plus" size={30} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    bottom: 30, // increased bottom margin for more space
    alignItems: 'center',
  },
  mainButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  optionContainer: {
    position: 'absolute',
    alignItems: 'center',
    right: 0,
    marginBottom: 20,
  },
  optionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  optionLabel: {
    marginTop: 4,
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 11,
  },
});

export default SpeedDial;
