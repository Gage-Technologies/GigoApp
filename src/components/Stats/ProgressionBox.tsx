import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme, Text, Card} from 'react-native-paper';
import HapticTouchableOpacity from '../Buttons/HapticTouchableOpacity';
interface ProgressionBoxProps {
  title: string;
  value: number;
  max: number;
  colorType: 'primary' | 'secondary' | 'golden' | 'custom';
  level: number;
  onPress: () => void;
  isDataHog?: boolean; // new prop to indicate if it's data_hog type
}

const ProgressionBox: React.FC<ProgressionBoxProps> = ({
  title,
  value,
  max,
  colorType,
  level,
  onPress,
  isDataHog = false, // default to false
}) => {
  const theme = useTheme();

  // ensure progress is a valid number between 0 and 1
  const progress = Math.min(Math.max(value / max, 0), 1) || 0;

  // determine the fill color based on the colorType prop
  const getFillColor = () => {
    switch (colorType) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'golden':
        return '#FFD700';
      case 'custom':
        return '#ec644b';
      default:
        return theme.colors.primary;
    }
  };

  return (
    <HapticTouchableOpacity onPress={onPress}>
      <Card
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.primary,
          },
        ]}>
        <Card.Content style={styles.content}>
          <Text style={[styles.title, {color: theme.colors.text}]}>{title}</Text>
          <Text style={[styles.levelText, {color: theme.colors.text}]}>
            Level {level}
          </Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarOutline,
                {borderColor: theme.colors.primary},
              ]}>
              <View
                style={[
                  styles.progressBar,
                  {
                    backgroundColor: getFillColor(),
                    width: `${progress * 100}%`,
                  },
                ]}
              />
            </View>
          </View>
          <Text style={[styles.progressText, {color: theme.colors.text}]}>
            {`${value.toFixed(2)}${isDataHog ? 'KB' : ''}/${max.toFixed(2)}${isDataHog ? 'KB' : ''}`}
          </Text>
        </Card.Content>
      </Card>
    </HapticTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    width: '100%',
    height: '85%',
    overflow: 'hidden',
  },
  content: {
    justifyContent: 'space-between',
    height: '100%',
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 16,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarOutline: {
    height: '100%',
    borderWidth: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  progressText: {
    fontSize: 13,
    textAlign: 'right',
    marginTop: 8,
  },
  levelText: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ProgressionBox;