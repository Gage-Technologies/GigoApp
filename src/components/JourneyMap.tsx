import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-paper';
import Config from 'react-native-config';

const JourneyMap = ({ unitId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const API_URL = Config.API_URL;

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
          const fetchedTasks = result.data.tasks.sort((a, b) => (a.node_above ?? 0) - (b.node_above ?? 0));
          setTasks(fetchedTasks);
        } else {
          Alert.alert('Error', 'Failed to fetch tasks');
        }
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [unitId]);

  const handlePressTask = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const renderTaskIcon = (task) => {
    const iconName = task.completed ? 'check-circle-outline' : 'help-circle-outline';
    const iconColor = task.completed ? 'green' : 'grey';
    return <Icon name={iconName} size={30} color={iconColor} />;
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
          <Text style={styles.modalTextTitle}>{selectedTask?.title}</Text>
          <Text style={styles.modalTextDescription}>{selectedTask?.description}</Text>
          <Button onPress={() => setModalVisible(false)}>Close</Button>
        </View>
      </View>
    </Modal>
  );

  const CurvedPath = ({ points }) => {
    const d = points.map((point, i, arr) => {
      if (i === 0) {
        return `M${point.x},${point.y}`;
      } else {
        const prev = arr[i - 1];
        const midX = (prev.x + point.x) / 2;
        return `Q${prev.x},${prev.y} ${midX},${point.y}`;
      }
    }).join(' ');

    return (
      <Svg height="100%" width="100%">
        <Path d={d} stroke="#008866" strokeWidth="3" fill="none" />
      </Svg>
    );
  };

  const JourneyStops = () => {
    const points = tasks.map((task, index) => ({
      x: index % 2 === 0 ? 50 : 150,
      y: index * 60 + 40,
    }));

    return (
      <View style={styles.pathContainer}>
        <CurvedPath points={points} />
        {tasks.map((task, index) => (
          <TouchableOpacity
            key={task._id}
            style={{
              ...styles.taskButton,
              left: index % 2 === 0 ? 40 : 140,
              top: index * 60 + 20,
            }}
            onPress={() => handlePressTask(task)}
          >
            {renderTaskIcon(task)}
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
        <JourneyStops />
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
    height: 600,
  },
  taskButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
});

export default JourneyMap;
