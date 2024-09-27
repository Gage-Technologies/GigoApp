import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Keyboard,
} from 'react-native';
import HapticTouchableOpacity from './Buttons/HapticTouchableOpacity';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text, useTheme} from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {BlurView} from '@react-native-community/blur';

type TabItem = {
  icon: string;
  label: string;
  screen: string;
};

const BottomBar = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const tabs: TabItem[] = [
    {icon: 'map-outline', label: 'Journey', screen: 'JourneyMain'},
    {icon: 'sign-direction', label: 'Detours', screen: 'Detour'},
    {icon: 'chart-bar', label: 'Stats', screen: 'Stats'},
    {icon: 'cog-outline', label: 'Settings', screen: 'AccountSettings'},
    {icon: 'information-outline', label: 'About', screen: 'AboutJourney'},
  ];

  // create shared values for animations
  const activeScale = useSharedValue(1);
  const bottomBarHeight = useSharedValue(60);

  useEffect(() => {
    // define event names based on platform
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    // set up keyboard show listener
    const keyboardShowListener = Keyboard.addListener(showEvent, () => {
      // set keyboard visibility to true
      setKeyboardVisible(true);
    });

    // set up keyboard hide listener
    const keyboardHideListener = Keyboard.addListener(hideEvent, () => {
      // set keyboard visibility to false
      setKeyboardVisible(false);
    });

    // clean up listeners on component unmount
    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  // animate bottom bar height based on keyboard visibility
  useEffect(() => {
    bottomBarHeight.value = withTiming(isKeyboardVisible ? 0 : 60, {
      duration: 300,
    });
  }, [isKeyboardVisible, bottomBarHeight]);

  // navigate to the selected screen
  const navigateTo = (screen: string, index: number) => {
    setActiveIndex(index);
    activeScale.value = withSpring(1.2, {damping: 10, stiffness: 100});
    // @ts-ignore
    navigation.navigate(screen);
  };

  const TabButton = ({tab, index}: {tab: TabItem; index: number}) => {
    const isActive = index === activeIndex;
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{scale: isActive ? activeScale.value : 1}],
    }));

    return (
      <HapticTouchableOpacity
        style={styles.tabItem}
        onPress={() => navigateTo(tab.screen, index)}>
        <Animated.View style={[styles.iconContainer, animatedStyle]}>
          <Icon
            name={tab.icon}
            size={28}
            color={isActive ? theme.colors.primary : theme.colors.onSurface}
          />
        </Animated.View>
        {isActive && (
          <Text style={[styles.label, {color: theme.colors.primary}]}>
            {tab.label}
          </Text>
        )}
      </HapticTouchableOpacity>
    );
  };

  const animatedContainerStyle = useAnimatedStyle(() => ({
    height: bottomBarHeight.value,
    opacity: bottomBarHeight.value === 0 ? 0 : 1,
  }));

  const BarContent = () => (
    <Animated.View style={[styles.content, animatedContainerStyle]}>
      {tabs.map((tab, index) => (
        <TabButton key={tab.screen} tab={tab} index={index} />
      ))}
    </Animated.View>
  );

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      {Platform.OS === 'ios' ? (
        <BlurView style={styles.blurView} blurType="light" blurAmount={10}>
          <BarContent />
        </BlurView>
      ) : (
        <View
          style={[styles.androidBar, {backgroundColor: theme.colors.surface}]}>
          <BarContent />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  content: {
    flexDirection: 'row',
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  blurView: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  androidBar: {
    borderRadius: 30,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default BottomBar;
