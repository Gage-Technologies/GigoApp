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
import JourneyMap from '../components/Journey/JourneyMap';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GetStarted from '../components/GetStarted';
import MarkdownRenderer from '../components/Markdown/MarkdownRenderer';
import { Unit } from '../models/Journey';
import HandoutOverlay from '../components/Journey/HandoutOverlay';
import { getTextColor } from '../services/utils';
import AwesomeButton from "react-native-really-awesome-button";
import { BlurView } from "@react-native-community/blur";

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

  const handleMap = (unit: Unit, index: number) => {
    const isLastIndex = index === units.length - 1;
    const allCompleted = unit.tasks.every(task => task.completed);
    const isPendingAcceptance = index === units.length - 1;

    // calculate task offset by summing the length of all previous units
    const taskOffset = units.slice(0, index).reduce((acc, unit) => acc + unit.tasks.length, 0);

    return (
      <View style={isPendingAcceptance ? [styles.unitContainer, { paddingTop: 20 }] : styles.unitContainer} key={unit._id}>
        <TouchableOpacity style={[styles.unitHeader, { backgroundColor: unit.color }]} onPress={() => setShowHandout(showHandout === index ? null : index)}>
          <Text style={[styles.unitTitle, { color: getTextColor(unit.color) }]}>
            {unit.name}
          </Text>
          <View style={styles.clipboardIcon}>
            <Ionicons name="document-text-outline" size={24} color={getTextColor(unit.color)} />
          </View>
        </TouchableOpacity>
        <View style={styles.unitContent}>
          <JourneyMap unitId={unit._id} unitIndex={index} taskOffset={taskOffset} />
        </View>
        {isPendingAcceptance && (
          <BlurView
            style={styles.blurOverlay}
            blurType="dark"
            blurAmount={3}
            reducedTransparencyFallbackColor={theme.colors.background}
          >
            <View style={styles.buttonWrapper}>
              <AwesomeButton
                width={300}
                height={80}
                borderRadius={20}
                textSize={28}
                backgroundColor={theme.colors.primary}
                // @ts-ignore
                backgroundDarker={theme.colors.primaryVariant}
                // @ts-ignore
                textColor={theme.colors.primaryVariant}
                onPress={() => {
                  // handle adding unit to journey
                  console.log("Add Unit To Journey");
                }}
                style={styles.addUnitButton}
              >
                Add Unit To Journey
              </AwesomeButton>
            </View>
          </BlurView>
        )}
        {isLastIndex && !isPendingAcceptance && (
          <TouchableOpacity onPress={() => setOpenDetourPop(true)} style={styles.fab}>
            <Text>Add Unit</Text>
          </TouchableOpacity>
        )}
        <RNModal
          animationType="slide"
          transparent={true}
          visible={openDetourPop}
          onRequestClose={() => setOpenDetourPop(false)}
        >
          <View style={styles.modalView}>
            <Text>Detour Selection Component</Text>
            <Button onPress={() => setOpenDetourPop(false)}>Close</Button>
          </View>
        </RNModal>
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
      <HandoutOverlay isVisible={showHandout !== null} onClose={() => setShowHandout(null)} unit={units[showHandout ?? 0]} />
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
    position: 'relative',
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
    backgroundColor: 'transparent',
    borderRadius: 50,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  unitWrapper: {
    width: '100%',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addUnitButton: {
    alignSelf: 'center',
    width: 300,
    height: 80,
  },
});

export default JourneyMain;
