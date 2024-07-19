/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {ScrollView, View, StyleSheet, Dimensions} from 'react-native';
import {useTheme, Text} from 'react-native-paper';
import StatBox from '../components/Stats/StatBox';
import ProgressionBox from '../components/Stats/ProgressionBox';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const STAT_CARD_WIDTH = SCREEN_WIDTH * 0.45;
const STAT_CARD_HEIGHT = STAT_CARD_WIDTH * 0.6;
const PROGRESSION_CARD_WIDTH = SCREEN_WIDTH * 0.9;
const PROGRESSION_CARD_HEIGHT = PROGRESSION_CARD_WIDTH * 0.4;

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
    {
      icon: 'chart-line',
      title: 'Performance',
      value: '85%',
      tooltip: 'Overall performance',
    },
    {
      icon: 'trophy',
      title: 'Achievements',
      value: '5',
      tooltip: 'Number of achievements',
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
    <ScrollView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
        Statistics
      </Text>
      <View style={styles.statsContainer}>
        {stats.map((item, index) => (
          <View key={index} style={styles.statBoxWrapper}>
            <StatBox {...item} />
          </View>
        ))}
      </View>
      <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
        Progressions
      </Text>
      <View style={styles.progressionsContainer}>
        {progressions.map((item, index) => (
          <View key={index} style={styles.progressionBoxWrapper}>
            <ProgressionBox {...item} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBoxWrapper: {
    width: STAT_CARD_WIDTH,
    height: STAT_CARD_HEIGHT,
    marginBottom: 6,
  },
  progressionsContainer: {
    flexDirection: 'column',
  },
  progressionBoxWrapper: {
    width: PROGRESSION_CARD_WIDTH,
    height: PROGRESSION_CARD_HEIGHT,
    marginBottom: -8,
    alignSelf: 'center',
  },
});

export default Stats;
