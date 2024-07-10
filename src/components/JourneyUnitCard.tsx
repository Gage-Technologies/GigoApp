import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
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
}

const JourneyUnitCard: React.FC<JourneyUnitCardProps> = ({
  data,
  onPress,
  isSelected,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.container,
          isSelected && {borderColor: theme.colors.primary, borderWidth: 2},
        ]}>
        <DetourCard data={data} onPress={() => {}} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default JourneyUnitCard;