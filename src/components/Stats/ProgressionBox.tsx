import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme, Icon} from 'react-native-paper';
import {Tooltip} from 'react-native-paper';

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
      <Tooltip popover={<Text>{tooltip}</Text>}>
        <Icon name={icon} size={40} color={theme.colors.primary} />
      </Tooltip>
      <Text style={[styles.value, {color: theme.colors.text}]}>{value}</Text>
      <Text style={[styles.title, {color: theme.colors.text}]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default StatBox;
