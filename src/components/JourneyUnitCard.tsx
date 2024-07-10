import React, {memo} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {useTheme} from 'react-native-paper';
import DetourCard from './DetourCard';

interface JourneyUnitCardProps {
  data: {
    id: string;
    name: string;
    image?: string;
    _id?: string;
    langs: string[];
  };
  onPress: () => void;
  isSelected: boolean;
  currentUnit: string;
}

const JourneyUnitCard: React.FC<JourneyUnitCardProps> = memo(
  ({data, onPress, isSelected, currentUnit}) => {
    const theme = useTheme();

    console.log(
      `Rendering JourneyUnitCard ${data._id}, isSelected:`,
      isSelected,
    );

    return (
      <TouchableOpacity onPress={onPress}>
        <View
          style={[
            styles.container,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              borderColor: isSelected ? theme.colors.primary : 'white',
              borderWidth: 2,
              backgroundColor: isSelected
                ? theme.colors.primary
                : theme.colors.surface,
              borderColor:
                currentUnit === data._id ? theme.colors.accent : 'transparent',
            },
          ]}>
          <Text
            style={[
              styles.title,
              {color: isSelected ? theme.colors.surface : theme.colors.text},
            ]}
            numberOfLines={2}>
            {data.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    margin: 5,
    padding: 8,
    height: 70,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default JourneyUnitCard;
