/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {useTheme, Text, Button} from 'react-native-paper';
import Config from 'react-native-config';
import StatBox from '../components/Stats/StatBox';
import ProgressionBox from '../components/Stats/ProgressionBox';
import ProgressionPopup from '../components/Stats/ProgressionPopup';
import StatPopup from '../components/Stats/StatPopup';
import DetermineProgressionLevel from '../utils/progression.tsx';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const STAT_CARD_WIDTH = SCREEN_WIDTH * 0.45;
const STAT_CARD_HEIGHT = STAT_CARD_WIDTH * 0.6;
const PROGRESSION_CARD_WIDTH = SCREEN_WIDTH * 0.9;
const PROGRESSION_CARD_HEIGHT = PROGRESSION_CARD_WIDTH * 0.4;

// define types for our data structures
type ProgrammingStats = {
  numbered_mastered_concepts: number;
  completion_failure_rate: number | null;
  focus_on_this: string;
  fot_detour_unit: number | null;
  most_struggled_concept: string;
  number_problems_solved_ct: number | null;
  avg_time_complete_byte: string | null;
};

type Progression = {
  data_hog: string;
  hungry_learner: string;
  measure_once: string;
  man_of_the_inside: string;
  scribe: string;
  tenacious: string;
  hot_streak: string;
  unit_mastery: string;
};

const Stats = () => {
  const theme = useTheme();
  const [stats, setStats] = useState<ProgrammingStats | null>(null);
  const [progression, setProgression] = useState<Progression | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProgression, setSelectedProgression] = useState(null);
  const [selectedStat, setSelectedStat] = useState(null);

  // helper function to calculate progression details
  const calculateProgressionDetails = (type: string, value: string) => {
    const [levelString, maxString] = DetermineProgressionLevel(type, value);
    let calculatedValue = parseFloat(value);
    let calculatedMax = parseFloat(maxString);

    // convert bytes to KB for data_hog
    if (type === 'data_hog') {
      calculatedValue = calculatedValue / 1024;
      calculatedMax = calculatedMax / 1024;
    }

    return {
      level: parseInt(levelString.split(' ')[1], 10),
      value: calculatedValue,
      max: calculatedMax,
      description: getProgressionDescription(type),
      isDataHog: type === 'data_hog', // flag to indicate if it's data_hog type
    };
  };

  // helper function to get progression descriptions
  const getProgressionDescription = (type: string) => {
    switch (type) {
      case 'data_hog':
        return 'Data Hog tracks the amount of executable code written (in KB). To level up you must write more code!';
      case 'hungry_learner':
        return 'Hungry Learner tracks the number of concepts learned. To level up Hungry Learner, you must master more concepts!';
      case 'man_of_the_inside':
        return 'Man on the Inside tracks the number of chats sent to Code Teacher. To level up Man on the Inside, you must send more chats to Code Teacher!';
      case 'scribe':
        return 'The Scribe tracks the number of comments written. To level up The Scribe, you write more comments in your code!';
      default:
        return '';
    }
  };

  // fetch stats and progression data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch stats
        const statsResponse = await fetch(
          `${Config.API_URL}/api/stats/getUserProgrammingStats`,
          {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: '{}',
          },
        );
        const statsData = await statsResponse.json();
        if (statsData.stats) {
          console.log(
            'Received stats:',
            JSON.stringify(statsData.stats, null, 2),
          );
          setStats(statsData.stats);
        } else {
          console.warn('Stats data is missing or invalid:', statsData);
        }

        // fetch progression
        const progressionResponse = await fetch(
          `${Config.API_URL}/api/stats/getProgression`,
          {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: '{}',
          },
        );
        const progressionData = await progressionResponse.json();
        if (progressionData.progression) {
          console.log(
            'Received progression:',
            JSON.stringify(progressionData.progression, null, 2),
          );
          setProgression(progressionData.progression);
        } else {
          console.warn(
            'Progression data is missing or invalid:',
            progressionData,
          );
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // process stats data for display
  const processedStats = stats
    ? [
        {
          icon: 'school',
          title: 'Mastered Concepts',
          value: stats.numbered_mastered_concepts?.toString() || '0',
          tooltip:
            'This stat tracks the number of unique units you have finished in journeys. Each completion of a unit counts towards a mastered concept',
        },
        {
          icon: 'target',
          title: 'Completion vs Failure',
          value: stats.completion_failure_rate != null
            ? (typeof stats.completion_failure_rate === 'number'
                ? stats.completion_failure_rate.toFixed(2)
                : stats.completion_failure_rate.toString())
            : 'N/A',
          tooltip:
            'This stat tracks your ratio of completions to failures when running code. To improve this you must make sure your code works properly before running it!',
        },
        {
          icon: 'laptop',
          title: 'Code Teacher Usage',
          value: stats.number_problems_solved_ct?.toString() || '0',
          tooltip:
            'This stat tracks the number of problems solved using Code Teacher.',
        },
        {
          icon: 'timer',
          title: 'Avg Completion Time',
          value: stats.avg_time_complete_byte || 'N/A',
          tooltip:
            'This stat tracks your average time to complete a task. Try to see how fast you can get!',
        },
      ]
    : [];

  // process progression data for display
  const processedProgressions = progression
    ? [
        {
          title: 'Data Hog',
          colorType: 'primary',
          ...calculateProgressionDetails('data_hog', progression.data_hog),
        },
        {
          title: 'Hungry Learner',
          colorType: 'secondary',
          ...calculateProgressionDetails('hungry_learner', progression.hungry_learner),
        },
        {
          title: 'Man on the Inside',
          colorType: 'golden',
          ...calculateProgressionDetails('man_of_the_inside', progression.man_of_the_inside),
        },
        {
          title: 'The Scribe',
          colorType: 'custom',
          ...calculateProgressionDetails('scribe', progression.scribe),
        },
      ]
    : [];

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
        Statistics
      </Text>
      <View style={styles.statsContainer}>
        {processedStats.map((item, index) => (
          <View key={index} style={styles.statBoxWrapper}>
            <StatBox {...item} onPress={() => setSelectedStat(item)} />
          </View>
        ))}
      </View>
      <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
        Progressions
      </Text>
      <View style={styles.progressionsContainer}>
        {processedProgressions.map((item, index) => (
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
        isDataHog={selectedProgression?.isDataHog || false}
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