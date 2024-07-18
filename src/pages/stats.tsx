import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, Dimensions, FlatList, Animated} from 'react-native';
import {useTheme, Text, ActivityIndicator} from 'react-native-paper';
import Config from 'react-native-config';
import StatBox from '../components/Stats/StatBox';
import ProgressionBox from '../components/Stats/ProgressionBox';

interface ProgrammingStats {
  numbered_mastered_concepts: number;
  completion_failure_rate: number;
  focus_on_this: string;
  most_struggled_concept: string;
  number_problems_solved_ct: number;
  avg_time_complete_byte: string;
}

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH * 0.8;
const ITEM_SPACING = (SCREEN_WIDTH - ITEM_WIDTH) / 2;

const Stats = () => {
  const theme = useTheme();
  const [stats, setStats] = useState<ProgrammingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${Config.API_URL}/api/stats/getUserProgrammingStats`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: '{}',
        },
      );

      const data = await response.json();
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (e) {
      console.log('failed to get stats: ', e);
    } finally {
      setLoading(false);
    }
  };

  const renderStatItem = ({item, index}) => {
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.carouselItem, {transform: [{scale}]}]}>
        <StatBox
          icon={item.icon}
          value={item.value}
          title={item.title}
          tooltip={item.tooltip}
        />
      </Animated.View>
    );
  };

  const renderProgressionItem = ({item, index}) => {
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.carouselItem, {transform: [{scale}]}]}>
        <ProgressionBox
          title={item.title}
          progress={item.progress}
          level={item.level}
          tooltip={item.tooltip}
        />
      </Animated.View>
    );
  };

  const statItems = stats
    ? [
        {
          icon: 'school',
          value: stats.numbered_mastered_concepts,
          title: 'Mastered Concepts',
          tooltip: 'Number of unique units finished in journeys',
        },
        {
          icon: 'target',
          value: parseFloat(stats.completion_failure_rate).toFixed(2),
          title: 'Completion v Failure',
          tooltip: 'Ratio of completions to failures',
        },
        {
          icon: 'magnify',
          value: stats.focus_on_this,
          title: 'Focus on This',
          tooltip: 'Area to focus on improving',
        },
        {
          icon: 'water',
          value: stats.most_struggled_concept,
          title: 'Most Struggled With',
          tooltip: 'Concept you struggle with most',
        },
        {
          icon: 'laptop',
          value: stats.number_problems_solved_ct,
          title: 'Problems Solved by Code Teacher',
          tooltip: 'Problems solved by Code Teacher',
        },
        {
          icon: 'timer',
          value: stats.avg_time_complete_byte,
          title: 'Average Byte Completion Time',
          tooltip: 'Average time to complete a byte',
        },
      ]
    : [];

  const progressionItems = [
    {
      title: 'Data Hog',
      progress: Math.random(),
      level: 1,
      tooltip: 'Amount of executable code written (in GB)',
    },
    {
      title: 'Hungry Learner',
      progress: Math.random(),
      level: 2,
      tooltip: 'Number of concepts learned',
    },
    {
      title: 'Measure Once, Cut Twice',
      progress: Math.random(),
      level: 3,
      tooltip: 'Number of syntax errors you have written',
    },
  ];

  if (loading) {
    return (
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <ActivityIndicator animating={true} color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.title, {color: theme.colors.primary}]}>Stats</Text>
      <FlatList
        data={statItems}
        renderItem={renderStatItem}
        keyExtractor={(item, index) => `stat-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContent}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false}
        )}
      />
      <Text style={[styles.title, {color: theme.colors.primary, marginTop: 20}]}>
        Progressions
      </Text>
      <FlatList
        data={progressionItems}
        renderItem={renderProgressionItem}
        keyExtractor={(item, index) => `progression-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContent}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false}
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  carouselContent: {
    paddingHorizontal: ITEM_SPACING,
  },
  carouselItem: {
    width: ITEM_WIDTH,
    padding: 10,
  },
});

export default Stats;