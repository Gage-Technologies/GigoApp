/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {ScrollView, View, StyleSheet, Dimensions} from 'react-native';
import {useTheme, Text} from 'react-native-paper';
import StatBox from '../components/Stats/StatBox';
import ProgressionBox from '../components/Stats/ProgressionBox';
import ProgressionPopup from '../components/Stats/ProgressionPopup';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const STAT_CARD_WIDTH = SCREEN_WIDTH * 0.45;
const STAT_CARD_HEIGHT = STAT_CARD_WIDTH * 0.6;
const PROGRESSION_CARD_WIDTH = SCREEN_WIDTH * 0.9;
const PROGRESSION_CARD_HEIGHT = PROGRESSION_CARD_WIDTH * 0.4;

const Stats = () => {
  const theme = useTheme();
  const [selectedProgression, setSelectedProgression] = useState<null | {
    title: string;
    description: string;
  }>(null);

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
    {
      title: 'Data Hog',
      value: 6,
      max: 10,
      colorType: 'primary',
      level: 3,
      description: 'Measures your ability to process and analyze large amounts of data efficiently.',
    },
    {
      title: 'Hungry Learner',
      value: 0,
      max: 10,
      colorType: 'secondary',
      level: 1,
      description: 'Tracks your progress in acquiring new knowledge and skills.',
    },
    {
      title: 'Man on the Inside',
      value: 7,
      max: 10,
      colorType: 'golden',
      level: 4,
      description: 'Represents your level of insider knowledge and understanding of complex systems.',
    },
    {
      title: 'The Scribe',
      value: 4,
      max: 10,
      colorType: 'custom',
      level: 2,
      description: 'Measures your writing proficiency and ability to communicate ideas effectively.',
    },
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
            <ProgressionBox
              {...item}
              onPress={() => setSelectedProgression(item)}
            />
          </View>
        ))}
      </View>
      <ProgressionPopup
        visible={!!selectedProgression}
        onClose={() => setSelectedProgression(null)}
        title={selectedProgression?.title || ''}
        description={selectedProgression?.description || ''}
      />
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
    marginBottom: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
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
    marginBottom: -14,
    alignSelf: 'center',
  },
});

export default Stats;