import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme, Text, Card, IconButton} from 'react-native-paper';

interface ProgressionBoxProps {
  title: string;
  value: number;
  max: number;
  tooltip: string;
}

const ProgressionBox: React.FC<ProgressionBoxProps> = ({
  title,
  value,
  max,
  tooltip,
}) => {
  const theme = useTheme();

  // ensure progress is a valid number between 0 and 1
  const progress = Math.min(Math.max(value / max, 0), 1) || 0;

  return (
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
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                backgroundColor: theme.colors.primary,
                width: `${progress * 100}%`,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, {color: theme.colors.text}]}>
          {`${value}/${max}`}
        </Text>
        <IconButton
          icon="help-circle-outline"
          size={16}
          onPress={() => console.log(tooltip)}
          style={styles.tooltipIcon}
        />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 1,
    width: '100%',
    height: '80%',
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
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    textAlign: 'right',
    marginTop: 8,
  },
  tooltipIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

export default ProgressionBox;
