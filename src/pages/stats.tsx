/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {useTheme, Text} from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';
import StatBox from '../components/Stats/StatBox';
import ProgressionBox from '../components/Stats/ProgressionBox';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const STAT_CARD_WIDTH = SCREEN_WIDTH * 0.4;
const STAT_CARD_HEIGHT = STAT_CARD_WIDTH * 1.5; // 1.5 times taller than wide
const PROGRESSION_CARD_HEIGHT = SCREEN_WIDTH * 0.25;
const PROGRESSION_CARD_WIDTH = SCREEN_WIDTH * 0.8;

const Stats = () => {
  const theme = useTheme();

  const stats = [
    {
      icon: 'school',
      title: 'Mastered Concepts',
      value: '10',
      tooltip: 'Number of mastered concepts',
    },
    {
      icon: 'target',
      title: 'Completion vs Failure',
      value: '0.19',
      tooltip: 'Ratio of completions to failures',
    },
    {
      icon: 'laptop',
      title: 'Problems Solved',
      value: '4',
      tooltip: 'Number of problems solved',
    },
    {
      icon: 'timer',
      title: 'Avg Completion Time',
      value: '7077ms',
      tooltip: 'Average time to complete a task',
    },
  ];

  const progressions = [
    {title: 'Data Hog', value: 6, max: 10, tooltip: 'Amount of data processed'},
    {title: 'Hungry Learner', value: 0, max: 10, tooltip: 'Learning progress'},
    {
      title: 'Man on the Inside',
      value: 7,
      max: 10,
      tooltip: 'Insider knowledge gained',
    },
    {title: 'The Scribe', value: 4, max: 10, tooltip: 'Writing proficiency'},
  ];

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
        Stats
      </Text>
      <View style={styles.carouselContainer}>
        <Carousel
          loop
          width={SCREEN_WIDTH}
          height={STAT_CARD_HEIGHT + 20} // add some extra space
          data={stats}
          renderItem={({item}) => <StatBox {...item} />}
          style={styles.carousel}
        />
      </View>
      <Text
        style={[
          styles.sectionTitle,
          {color: theme.colors.text, marginTop: 20},
        ]}>
        Progressions
      </Text>
      <Carousel
        loop
        width={SCREEN_WIDTH}
        height={PROGRESSION_CARD_HEIGHT}
        data={progressions}
        renderItem={({item}) => <ProgressionBox {...item} />}
        style={styles.carousel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  carouselContainer: {
    height: STAT_CARD_HEIGHT + 20, // match the Carousel height
  },
  carousel: {
    marginBottom: 20,
  },
});

export default Stats;