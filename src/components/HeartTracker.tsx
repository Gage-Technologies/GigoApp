import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectRemainingHearts,
  updateHeartsState,
  initialHeartsStateUpdate,
} from '../reducers/hearts';
import Config from 'react-native-config';

interface HeartTrackerProps {
  small?: boolean;
}

const HeartTracker: React.FC<HeartTrackerProps> = ({small}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const activeHearts = useSelector(selectRemainingHearts);

  const getActiveHearts = async () => {
    try {
      const response = await fetch(
        `${Config.API_URL}/api/bytes/getUsedHeartCountToday`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        },
      );

      const res = await response.json();

      if (res && res.remaining_hearts !== undefined) {
        if (res.remaining_hearts !== activeHearts) {
          const newState = {
            ...initialHeartsStateUpdate,
            remainingHearts: res.remaining_hearts,
          };
          dispatch(updateHeartsState(newState));
        }
      } else {
        console.error('Invalid response from getUsedHeartCountToday');
      }
    } catch (error) {
      console.error('Error fetching active hearts:', error);
    }
  };

  useEffect(() => {
    getActiveHearts();
  }, []);

  return (
    <View style={styles.heartsContainer}>
      <Icon name="heart" size={small ? 20 : 24} color={theme.colors.error} />
      <Text
        style={[
          styles.statsText,
          {color: theme.colors.onSurface},
          small && styles.smallText,
        ]}>
        {activeHearts}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  heartsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    marginLeft: 8,
  },
  smallText: {
    fontSize: 14,
    marginLeft: 4,
  },
});

export default HeartTracker;
