import React, {useState, useRef} from 'react';
import {
  View,
  PanResponder,
  Animated,
  StyleSheet,
} from 'react-native';
import HapticTouchableOpacity from './Buttons/HapticTouchableOpacity';
import {useTheme} from 'react-native-paper';

interface UnitSelectorProps {
  unitCount: number;
  selectedIndex: number;
  onSelectUnit: (index: number) => void;
  unitHeight: number;
}

const UnitSelector: React.FC<UnitSelectorProps> = ({
  unitCount,
  selectedIndex,
  onSelectUnit,
  unitHeight,
}) => {
  const theme = useTheme();
  const [barHeight, setBarHeight] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newIndex = Math.max(
        0,
        Math.min(
          Math.round(gestureState.moveY / (barHeight / unitCount)),
          unitCount - 1,
        ),
      );
      onSelectUnit(newIndex);
    },
    onPanResponderRelease: () => {
      pan.flattenOffset();
    },
  });

  return (
    <View
      style={[styles.container, {height: unitCount * unitHeight}]}
      onLayout={event => setBarHeight(event.nativeEvent.layout.height)}
      {...panResponder.panHandlers}>
      <View
        style={[
          styles.bar,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            backgroundColor: 'white',
            top: unitHeight / 2,
            height: (unitCount - 1) * unitHeight,
          },
        ]}
      />
      {Array.from({length: unitCount}).map((_, index) => (
        <HapticTouchableOpacity
          key={index}
          style={[
            styles.circle,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              backgroundColor:
                index === selectedIndex ? theme.colors.primary : 'white',
              borderColor: theme.colors.primary,
              top: index * unitHeight + unitHeight / 2 - 8,
            },
          ]}
          onPress={() => onSelectUnit(index)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bar: {
    width: 2,
    position: 'absolute',
    left: '50%',
    marginLeft: -1,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    position: 'absolute',
    left: 7,
  },
});

export default UnitSelector;
