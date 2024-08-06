import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme, Text, Card} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface StatBoxProps {
  icon: string;
  title: string;
  value: string;
  tooltip: string;
  onPress: () => void;
}

const StatBox: React.FC<StatBoxProps> = ({
  icon,
  title,
  value,
  tooltip,
  onPress,
}) => {
  const theme = useTheme();

  // function to determine icon color based on icon name
  const getIconColor = (iconName: string) => {
    switch (iconName) {
      case 'school':
        return '#808A93';
      case 'target':
        return '#ec644b';
      case 'laptop':
        return theme.colors.secondary;
      case 'timer':
        return 'white';
      case 'chart-line':
        return theme.colors.primary;
      case 'trophy':
        return '#EFA900';
      default:
        return theme.colors.text;
    }
  };

  // function to format time for avg completion time
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  // function to format value based on stat type
  const formatValue = (title: string, value: string): string => {
    if (title === 'Avg Completion Time') {
      const seconds = parseFloat(value);
      return isNaN(seconds) ? 'N/A' : formatTime(seconds);
    }
    return value;
  };

  const formattedValue = formatValue(title, value);

  return (
    <TouchableOpacity onPress={onPress}>
      <Card
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.primary,
          },
        ]}>
        <Card.Content style={styles.content}>
          <View style={styles.iconContainer}>
            <Icon
              name={icon}
              size={24}
              color={getIconColor(icon)}
              style={styles.icon}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.value, {color: theme.colors.text}]}>
              {formattedValue}
            </Text>
            <Text style={[styles.title, {color: theme.colors.text}]}>
              {title}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    borderWidth: 1,
    width: '100%',
    height: '90%',
    overflow: 'hidden',
    padding: 2,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100%',
  },
  iconContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    bottom: 8,
  },
  title: {
    fontSize: 13,
    textAlign: 'center',
    top: 8,
  },
});

export default StatBox;
