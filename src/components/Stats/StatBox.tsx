import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme, Text, IconButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface StatBoxProps {
  icon: string;
  value: string | number;
  title: string;
  tooltip: string;
}

const StatBox: React.FC<StatBoxProps> = ({icon, value, title, tooltip}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, {borderColor: theme.colors.primary}]}>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={60} color={theme.colors.primary} />
      </View>
      <Text style={[styles.value, {color: theme.colors.primary}]}>{value}</Text>
      <Text style={[styles.title, {color: theme.colors.text}]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default StatBox;
