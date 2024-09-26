import React, {useState, useRef} from 'react';
import {View, StyleSheet, PanResponder, Animated, Text} from 'react-native';

interface CursorJoystickProps {
  onMove: (dx: number, dy: number) => void;
  color: string;
  textColor: string;
}

const CursorJoystick: React.FC<CursorJoystickProps> = ({
  onMove,
  color,
  textColor,
}) => {
  const [moving, setMoving] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setMoving(true);
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: (_, gestureState) => {
        // calculate the distance from the center
        const distance = Math.sqrt(gestureState.dx ** 2 + gestureState.dy ** 2);
        const maxDistance = 30; // maximum allowed distance from center

        // normalize the movement
        let dx = gestureState.dx;
        let dy = gestureState.dy;

        if (distance > maxDistance) {
          dx = (dx / distance) * maxDistance;
          dy = (dy / distance) * maxDistance;
        }

        // update the position
        pan.setValue({x: dx, y: dy});

        // scale down the movement velocity
        const scaleFactor = 1; // adjust this value to fine-tune the movement speed
        // call the onMove callback with scaled down values
        onMove(dx * scaleFactor, dy * scaleFactor);
      },
      onPanResponderRelease: () => {
        setMoving(false);
        pan.flattenOffset();
        Animated.spring(pan, {
          toValue: {x: 0, y: 0},
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  return (
    <View style={[styles.container, {backgroundColor: color}]}>
      <Animated.View
        style={[
          styles.joystick,
          {
            transform: [{translateX: pan.x}, {translateY: pan.y}],
            backgroundColor: moving ? textColor : color,
          },
        ]}
        {...panResponder.panHandlers}>
        <Text
          style={[styles.joystickText, {color: moving ? color : textColor}]}>
          move
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joystick: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joystickText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CursorJoystick;
