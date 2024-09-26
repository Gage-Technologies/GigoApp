import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
  LayoutAnimation,
  useColorScheme,
  Dimensions,
} from 'react-native';
import CursorJoystick from './CursorJoystick';

/**
 * compact custom keyboard component for programming on mobile
 * provides essential programming-specific keys in a two-line layout
 * appears above the default keyboard
 * automatically adjusts colors to match the os theme
 * includes arrow keys for navigation
 */
const ByteKeyboard: React.FC<{
  onKeyPress: (key: string) => void;
  onCursorMove: (dx: number, dy: number) => void;
}> = ({onKeyPress, onCursorMove}) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const colorScheme = useColorScheme();

  // determine colors based on the current theme
  const colors = {
    background: colorScheme === 'dark' ? '#1c1c1e' : '#cccccc',
    key: colorScheme === 'dark' ? '#2c2c2e' : '#ffffff',
    text: colorScheme === 'dark' ? '#ffffff' : '#000000',
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // updated keys array without arrow keys
  const keys = [
    ['{', '}', '(', ')', '[', ']', '<', '>', 'Tab'],
    ['/', '\\', ';', ':', ',', '.', '"', "'"],
  ];

  if (!isKeyboardVisible) {
    return null;
  }

  // helper function to render key content
  const renderKeyContent = (key: string) => {
    return <Text style={[styles.keyText, {color: colors.text}]}>{key}</Text>;
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.keyboardContent}>
        <View style={styles.keysContainer}>
          {keys.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map(key => (
                <TouchableOpacity
                  key={key}
                  style={[styles.key, {backgroundColor: colors.key}]}
                  onPress={() => onKeyPress(key)}>
                  {renderKeyContent(key)}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.joystickContainer}>
          <CursorJoystick
            onMove={onCursorMove}
            color={colors.key}
            textColor={colors.text}
          />
        </View>
      </View>
    </View>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
    paddingTop: 8,
    marginBottom: 48,
  },
  keyboardContent: {
    flexDirection: 'row',
  },
  keysContainer: {
    flex: 0.8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 2,
  },
  key: {
    padding: 8,
    borderRadius: 4,
    minWidth: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  keyText: {
    fontSize: 14,
  },
  joystickContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ByteKeyboard;
