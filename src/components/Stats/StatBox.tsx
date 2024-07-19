import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme, Text, Card, IconButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface StatBoxProps {
  icon: string;
  title: string;
  value: string;
  tooltip: string;
}

const StatBox: React.FC<StatBoxProps> = ({icon, title, value, tooltip}) => {
  const theme = useTheme();

  return (
    <Card style={[styles.container, {backgroundColor: theme.colors.surface}]}>
      <Card.Content style={styles.content}>
        <IconButton
          icon="help-circle-outline"
          size={16}
          color={theme.colors.text}
          onPress={() => console.log(tooltip)}
          style={styles.tooltipIcon}
        />
        <View style={styles.iconContainer}>
          <Icon name={icon} size={60} color={theme.colors.primary} />
        </View>
        <Text style={[styles.value, {color: theme.colors.text}]}>{value}</Text>
        <Text style={[styles.title, {color: theme.colors.text}]}>{title}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    elevation: 4,
    width: 350,
    height: 245,
    margin: 8,
  },
  content: {
    justifyContent: 'space-between',
    height: '100%',
    padding: 12,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  value: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
  },
  tooltipIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

export default StatBox;