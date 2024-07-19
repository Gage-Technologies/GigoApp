/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {ScrollView, View, StyleSheet, Dimensions} from 'react-native';
import {useTheme, Text} from 'react-native-paper';
import StatBox from '../components/Stats/StatBox';
import ProgressionBox from '../components/Stats/ProgressionBox';
import ProgressionPopup from '../components/Stats/ProgressionPopup';
import StatPopup from '../components/Stats/StatPopup';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const STAT_CARD_WIDTH = SCREEN_WIDTH * 0.45;
const STAT_CARD_HEIGHT = STAT_CARD_WIDTH * 0.6;
const PROGRESSION_CARD_WIDTH = SCREEN_WIDTH * 0.9;
const PROGRESSION_CARD_HEIGHT = PROGRESSION_CARD_WIDTH * 0.4;

const Stats = () => {
  const theme = useTheme();
  const [selectedProgression, setSelectedProgression] = useState<null | {
    title: string;
    value: number;
    max: number;
    colorType: string;
    level: number;
    description: string;
  }>(null);
  const [selectedStat, setSelectedStat] = useState<null | {
    icon: string;
    title: string;
    value: string;
    tooltip: string;
  }>(null);

  const stats = [
    {
      icon: 'school',
      title: 'Mastered Concepts',
      value: '10',
      tooltip:
        'This stat tracks the number of unique units you have finished in journeys. Each completion of a unit counts towards a mastered concept',
    },
    {
      icon: 'target',
      title: 'Completion vs Failure',
      value: '0.19',
      tooltip:
        'This stat tracks your ratio of completions to failures when running code. To improve this you must make sure your code works properly before running it!',
    },
    {
      icon: 'laptop',
      title: 'Code Teacher Usage',
      value: '4',
      tooltip:
        'This stat tracks the number of problems solved using Code Teacher.',
    },
    {
      icon: 'timer',
      title: 'Avg Completion Time',
      value: '7077ms',
      tooltip:
        'This stat tracks your average time to complete a task. Try to see how fast you can get!',
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
      tooltip:
        'This stat tracks the number of achievements you have earned. To increase this you must level up your Progressions',
    },
  ];

  const progressions = [
    {
      title: 'Data Hog',
      value: 6,
      max: 10,
      colorType: 'primary',
      level: 3,
      description:
        'Data Hog tracks the amount of executable code written (in GB). To level up you must write more code!',
    },
    {
      title: 'Hungry Learner',
      value: 4,
      max: 10,
      colorType: 'secondary',
      level: 1,
      description:
        'Hungry Learner tracks the number of concepts learned. To level up Hungry Learner, you must master more concepts!',
    },
    {
      title: 'Man on the Inside',
      value: 7,
      max: 10,
      colorType: 'golden',
      level: 4,
      description:
        'Man on the Inside tracks the number of chats sent to Code Teacher. To level up Man on the Inside, you must send more chats to Code Teacher!',
    },
    {
      title: 'The Scribe',
      value: 4,
      max: 10,
      colorType: 'custom',
      level: 2,
      description:
        'The Scribe tracks the number of comments written. To level up The Scribe, you write more comments in your code!',
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
            <StatBox {...item} onPress={() => setSelectedStat(item)} />
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
        value={selectedProgression?.value || 0}
        max={selectedProgression?.max || 10}
        colorType={selectedProgression?.colorType || 'primary'}
        level={selectedProgression?.level || 1}
        description={selectedProgression?.description || ''}
      />
      <StatPopup
        visible={!!selectedStat}
        onClose={() => setSelectedStat(null)}
        title={selectedStat?.title || ''}
        icon={selectedStat?.icon || ''}
        value={selectedStat?.value || ''}
        tooltip={selectedStat?.tooltip || ''}
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
