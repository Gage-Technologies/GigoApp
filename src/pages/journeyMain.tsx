import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Modal as RNModal } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import Config from 'react-native-config';
import JourneyMap from '../components/JourneyMap';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ensure Ionicons is imported here as well

const JourneyMain = () => {
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState([]);
  const [activeJourney, setActiveJourney] = useState(true);
  const [userId, setUserId] = useState(1684239109222039552);
  const [showHandout, setShowHandout] = useState(null);
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
        throw new Error(`Failed to fetch start of journey, status ${response.status}`);
      }

      let map = await response.json();
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
          limit: 5
        })
      });

      let res = await response.json();
      if (!response.ok) {
        throw new Error('Failed to fetch user map');
      }

      if (!res.success) {
        setActiveJourney(true);
        setLoading(false);
        return;
      }

      const fetchedUnits = await Promise.all(res.user_map.units.map(async (unit) => {
        response = await fetch(`${API_URL}/api/journey/getTasksInUnit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            unit_id: unit._id
          })
        });

        let tasksResponse = await response.json();
        if (!response.ok) {
          throw new Error('Failed to fetch tasks in unit');
        }

        const tasks = tasksResponse.data ? tasksResponse.data.tasks : [];
        if (!tasks) {
          console.error('No tasks array in the response for unit:', unit._id);
          return { ...unit, tasks: [] };
        }

        const sortedTasks = tasks.sort((a, b) => {
          if (a.node_above === null) return -1;
          if (b.node_above === null) return 1;
          return a.node_above - b.node_above;
        });

        return { ...unit, tasks: sortedTasks };
      }));

      setUnits(prevUnits => [...prevUnits, ...fetchedUnits]);
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to fetch tasks. Please check your network connection.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const getTextColor = (backgroundColor) => {
    const color = backgroundColor.substring(1);
    const rgb = parseInt(color, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness > 186 ? '#000000' : '#FFFFFF';
  };

  const handleMap = (unit, index) => {
    const isLastIndex = index === units.length - 1;
    const allCompleted = unit.tasks.every(task => task.completed);

    return (
      <View style={styles.unitContainer} key={unit._id}>
        <View style={[styles.unitBox, { backgroundColor: unit.color }]}>
          <View style={styles.unitHeader}>
            <TouchableOpacity onPress={() => setShowHandout(showHandout === index ? null : index)} style={styles.clipboardIcon}>
              <Ionicons name="clipboard-outline" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setShowHandout(showHandout === index ? null : index)}>
            <Text style={[styles.unitTitle, { color: getTextColor(unit.color), fontFamily: theme.fonts.medium.fontFamily }]}>
              {unit.name}
            </Text>
          </TouchableOpacity>
          {showHandout === index ? (
            <Text style={[styles.handoutText, { color: getTextColor(unit.color) }]}>{unit.handout}</Text>
          ) : (
            <JourneyMap unitId={unit._id} />
          )}
        </View>
        {isLastIndex && (
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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Text style={[styles.header, { color: theme.colors.text }]}>Your Journey</Text>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        units.map((unit, index) => (
          <View key={unit._id} style={{ marginBottom: 20 }}>
            {handleMap(unit, index)}
          </View>
        ))
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitBox: {
    width: 380,
    padding: 30,
    borderRadius: 30,
    position: 'relative',
  },
  unitTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
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
    marginTop: 20,
    fontSize: 14,
    maxWidth: '90%',
  },
  unitHeader: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  clipboardIcon: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 50,
  },
});

export default JourneyMain;
