import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text, useTheme} from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

type TabItem = {
  icon: string;
  label: string;
  screen: string;
};

const BottomBar = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(1);

  const tabs: TabItem[] = [
    {icon: 'poll', label: 'Stats', screen: 'Stats'},
    {icon: 'map', label: 'Journey', screen: 'JourneyMain'},
    {icon: 'cog', label: 'Settings', screen: 'AccountSettings'},
    {icon: 'information-outline', label: 'About', screen: 'AboutJourney'}, // new tab added
  ];

  // create shared value for animation
  const activeScale = useSharedValue(1.2);

  // navigate to the selected screen
  const navigateTo = (screen: string, index: number) => {
    setActiveIndex(index);
    activeScale.value = withTiming(1.2);
    // @ts-ignore
    navigation.navigate(screen);
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.surface}]}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={tab.screen}
          style={styles.tabItem}
          onPress={() => navigateTo(tab.screen, index)}>
          <Animated.View
            style={[
              styles.iconContainer,
              useAnimatedStyle(() => ({
                transform: [
                  {
                    scale: index === activeIndex ? activeScale.value : 1,
                  },
                ],
              })),
            ]}>
            <Icon
              name={tab.icon}
              size={24}
              color={
                index === activeIndex
                  ? theme.colors.primary
                  : theme.colors.onSurface
              }
            />
          </Animated.View>
          <Text
            style={[
              styles.label,
              {
                color:
                  index === activeIndex
                    ? theme.colors.primary
                    : theme.colors.onSurface,
              },
            ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
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
  },
});

export default BottomBar;