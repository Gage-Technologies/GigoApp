import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator, StyleSheet, Alert, Dimensions } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { Button, useTheme } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons'; // For clipboard icon
import Config from 'react-native-config';
import { useNavigation } from '@react-navigation/native';
import { Task } from '../models/Journey';

const JourneyMap = ({ unitId }: { unitId: string }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [handoutVisible, setHandoutVisible] = useState(false);
  const [handoutContent, setHandoutContent] = useState('');
  const [unitTitle, setUnitTitle] = useState(''); // New state for unit title
  const API_URL = Config.API_URL;
  const theme = useTheme();

  const navigation = useNavigation();

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/journey/getTasksInUnit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ unit_id: unitId, user_id: 1684239109222039552 })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          const fetchedTasks = result.data.tasks.sort((a: Task, b: Task) => {
            // parse node_above to numbers, defaulting to 0 if null or undefined
            const aNodeAbove = a.node_above ? parseInt(a.node_above, 10) : 0;
            const bNodeAbove = b.node_above ? parseInt(b.node_above, 10) : 0;
            return aNodeAbove - bNodeAbove;
          });
          setTasks(fetchedTasks);
          setHandoutContent(result.data.handout);
          setUnitTitle(result.data.unitTitle); // Set the unit title
        } else {
          Alert.alert('Error', 'Failed to fetch tasks');
        }
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [unitId]);

  const handlePressTask = (task: Task) => {
    // navigate to the byte page
    console.log(JSON.stringify(task));
    // @ts-ignore
    navigation.navigate('Byte', { byteId: task.code_source_id, isJourney: true });
  };

  const toggleHandout = () => {
    setHandoutVisible(!handoutVisible);
  };

  const renderTaskIcon = (task: Task, index: number) => {
    if (task.completed) {
      return (
        <View style={[styles.iconContainer, styles.completedIcon]}>
          <FontAwesome name="check" size={40} color="white" />
        </View>
      );
    } else if (task.inProgress || index === 0) {
      return (
        <View style={[styles.iconContainer, styles.unlockedIcon, { backgroundColor: theme.colors.secondary }]}>
          <FontAwesome name="unlock" size={40} color="white" />
        </View>
      );
    } else {
      return (
        <View style={[styles.iconContainer, styles.lockedIcon]}>
          <FontAwesome name="question" size={40} color="white" />
        </View>
      );
    }
  };

  const TaskModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTextTitle}>{selectedTask?.name}</Text>
          <Text style={styles.modalTextDescription}>{selectedTask?.description}</Text>
          <Button mode="contained" onPress={() => setModalVisible(false)}>Close</Button>
        </View>
      </View>
    </Modal>
  );

  const CurvedPath = ({ points }: { points: { x: number; y: number }[] }) => {
    const d = points.map((point, i) => {
      if (i === 0) {
        return `M${point.x},${point.y}`;
      } else {
        return `L${point.x},${point.y}`;
      }
    }).join(' ');

    return (
      <Svg height="100%" width="100%">
        <Path d={d} stroke="#008866" strokeWidth="3" fill="none" />
      </Svg>
    );
  };

  const JourneyStops = () => {
    const screenWidth = Dimensions.get('window').width;
    const buttonSize = 100;
    const shiftLeft = 30;

    const points = tasks.map((task, index) => ({
      x: index % 2 === 0 ? screenWidth * 0.25 - shiftLeft : screenWidth * 0.75 - shiftLeft,
      y: index * 80 - 20,
    }));

    const containerHeight = points.length * 80;

    return (
      <View style={[styles.pathContainer, { height: containerHeight }]}>
        <CurvedPath points={points} />
        {tasks.map((task, index) => (
          <TouchableOpacity
            key={task._id}
            style={{
              ...styles.taskButton,
              left: points[index].x - buttonSize / 2,
              top: points[index].y - buttonSize / 2,
              backgroundColor: task.completed ? '#29C18C' : (task.inProgress || index === 0 ? theme.colors.secondary : '#808080'),
            }}
            onPress={() => (task.inProgress || index === 0) && handlePressTask(task)}
          >
            {renderTaskIcon(task, index)}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View style={styles.unitHeader}>
          </View>
          <Text style={styles.unitTitle}>
            {unitTitle}
          </Text>
          {handoutVisible ? (
            <View style={styles.handoutContainer}>
              <ScrollView>
                <Text style={styles.handoutText}>{handoutContent}</Text>
              </ScrollView>
            </View>
          ) : (
            <JourneyStops />
          )}
        </>
      )}
      {selectedTask && <TaskModal />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  taskText: {
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
  modalTextTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalTextDescription: {
    textAlign: 'center',
    fontSize: 16,
  },
  pathContainer: {
    position: 'relative',
    width: '100%',
  },
  taskButton: {
    position: 'absolute',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  completedIcon: {
    backgroundColor: '#29C18C',
  },
  inProgressIcon: {
    backgroundColor: '#FFA500',
  },
  lockedIcon: {
    backgroundColor: '#808080',
  },
  unlockedIcon: {
    backgroundColor: '#FFA500',
  },
  scrollView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  unitTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 80,
    marginBottom: 10,
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
  handoutContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 10,
  },
  handoutText: {
    fontSize: 16,
  },
});

export default JourneyMap;
