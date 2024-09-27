import React, {useState, useRef, useEffect} from 'react';
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
  const lastMovement = useRef({dx: 0, dy: 0});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
        // start continuous movement
        startContinuousMovement();
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

        // update last movement
        lastMovement.current = {dx, dy};
      },
      onPanResponderRelease: () => {
        setMoving(false);
        pan.flattenOffset();
        Animated.spring(pan, {
          toValue: {x: 0, y: 0},
          useNativeDriver: false,
        }).start();
        // stop continuous movement
        stopContinuousMovement();
      },
    }),
  ).current;

  const startContinuousMovement = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      const {dx, dy} = lastMovement.current;
      const scaleFactor = 0.1; // adjust this value to fine-tune the movement speed
      onMove(dx * scaleFactor, dy * scaleFactor);
    }, 150); // approximately 60fps
  };

  const stopContinuousMovement = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      // cleanup interval on component unmount
      stopContinuousMovement();
    };
  }, []);

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
