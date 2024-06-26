import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal as RNModal,
} from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import Config from 'react-native-config';
import JourneyMap from '../components/JourneyMap';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GetStarted from '../components/GetStarted';
import MarkdownRenderer from '../components/Markdown/MarkdownRenderer';
import { Unit } from '../models/Journey';

const JourneyMain = () => {
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [activeJourney, setActiveJourney] = useState<boolean | null>(null);
  const [userId, setUserId] = useState(1684239109222039552);
  const [showHandout, setShowHandout] = useState<number | null>(null);
  const [openDetourPop, setOpenDetourPop] = useState(false);

  const API_URL = Config.API_URL;
  const theme = useTheme();

  const getTasks = async () => {
    try {
      setLoading(true);

      let response = await fetch(`${API_URL}/api/journey/determineStart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch start of journey, status ${response.status}`,
        );
      }

      let map = await response.json();
      console.log('Map response:', map);
      if (!map.started_journey) {
        setActiveJourney(false);
        setLoading(false);
        return;
      }

      response = await fetch(`${API_URL}/api/journey/getUserMap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          skip: units.length,
          limit: 5,
        }),
      });

      let res = await response.json();
      console.log('User map response:', res);
      if (!response.ok) {
        throw new Error('Failed to fetch user map');
      }

      if (!res.success) {
        setActiveJourney(false);
        setLoading(false);
        return;
      }

      const fetchedUnits = await Promise.all(
        res.user_map.units.map(async (unit: { _id: any }) => {
          const response = await fetch(`${API_URL}/api/journey/getTasksInUnit`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: userId,
              unit_id: unit._id,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch tasks in unit');
          }

          const tasksResponse = await response.json();
          const tasks = tasksResponse.data ? tasksResponse.data.tasks : [];
          if (!tasks.length) {
            console.error('No tasks array in the response for unit:', unit._id);
            return { ...unit, tasks: [] };
          }

          const sortedTasks = tasks.sort((a: any, b: any) => {
            if (a.node_above === null) return -1;
            if (b.node_above === null) return 1;
            return a.node_above - b.node_above;
          });

          return { ...unit, tasks: sortedTasks };
        })
      );

      setUnits(prevUnits => [...prevUnits, ...fetchedUnits]);
      setActiveJourney(true); // Journey has started
      setLoading(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to fetch tasks. Please check your network connection.');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Fetching tasks...');
    getTasks();
  }, []);

  const getTextColor = (backgroundColor: string) => {
    const color = backgroundColor.substring(1);
    const rgb = parseInt(color, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness > 186 ? '#000000' : '#FFFFFF';
  };

  const handleMap = (unit: Unit, index: number) => {
    const isLastIndex = index === units.length - 1;
    const allCompleted = unit.tasks.every(task => task.completed);

    // calculate task offset by summing the length of all previous units
    const taskOffset = units.slice(0, index).reduce((acc, unit) => acc + unit.tasks.length, 0);

    return (
      <View style={styles.unitContainer} key={unit._id}>
        <View style={[styles.unitHeader, { backgroundColor: unit.color }]}>
          <TouchableOpacity onPress={() => setShowHandout(showHandout === index ? null : index)}>
            <Text style={[styles.unitTitle, { color: getTextColor(unit.color) }]}>
              {unit.name}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowHandout(showHandout === index ? null : index)} style={styles.clipboardIcon}>
            <Ionicons name="clipboard-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.unitContent}>
          {showHandout === index ? (
            <MarkdownRenderer style={styles.handoutText} markdown={unit.handout} textColor={getTextColor(unit.color)} />
          ) : (
            <JourneyMap unitId={unit._id} unitIndex={index} taskOffset={taskOffset} />
          )}
        </View>
        {isLastIndex && (
          <TouchableOpacity onPress={() => setOpenDetourPop(true)} style={styles.fab}>
            <Text>Add Unit</Text>
          </TouchableOpacity>
        )}
        {/* <RNModal
          animationType="slide"
          transparent={true}
          visible={openDetourPop}
          onRequestClose={() => setOpenDetourPop(false)}
        >
          <View style={styles.modalView}>
            <Text>Detour Selection Component</Text>
            <Button onPress={() => setOpenDetourPop(false)}>Close</Button>
          </View>
        </RNModal> */}
        </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  console.log('Units:', units.length);

  return (
    <ScrollView 
      style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.scrollViewContent}
    >
      {activeJourney ? (
        units.map((unit, index) => handleMap(unit, index))
      ) : (
        <GetStarted getTasks={getTasks} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  unitContainer: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  unitTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    flexWrap: 'wrap',
    maxWidth: 400,
  },
  completedIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    borderRadius: 50,
    backgroundColor: '#41c18c',
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#ef9558',
    padding: 10,
    borderRadius: 30,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  handoutText: {
    fontSize: 14,
  },
  unitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 20,
  },
  unitContent: {
    padding: 15,
  },
  clipboardIcon: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 50,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  unitWrapper: {
    width: '100%',
  },
});

export default JourneyMain;
