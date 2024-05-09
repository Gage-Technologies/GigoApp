import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Use community icons for more variety
import { Button } from 'react-native-paper'; // Using react-native-paper for Material Design components

const JourneyMap = ({ unitId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      // Dummy fetch function, replace with your actual data fetching logic
      const fetchedTasks = await fetchTasksForUnit(unitId);
      setTasks(fetchedTasks);
      setLoading(false);
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

  return (
    <ScrollView>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        tasks.map((task, index) => (
          <TouchableOpacity key={index} style={styles.taskContainer} onPress={() => handlePressTask(task)}>
            <Text style={styles.taskText}>{task.title}</Text>
            {renderTaskIcon(task)}
          </TouchableOpacity>
        ))
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
});

export default JourneyMap;
