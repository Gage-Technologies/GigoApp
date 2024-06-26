import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator, StyleSheet, Alert, Dimensions } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { Button, useTheme } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // For modern icons
import Config from 'react-native-config';
import { useNavigation } from '@react-navigation/native';
import { Task } from '../models/Journey';
import AwesomeButton from "react-native-really-awesome-button";

const JourneyMap = ({ unitId, unitIndex, taskOffset }: { unitId: string, unitIndex: number, taskOffset: number }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [handoutVisible, setHandoutVisible] = useState(false);
  const [handoutContent, setHandoutContent] = useState('');
  const [unitTitle, setUnitTitle] = useState(''); // new state for unit title
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
          console.log("fetchedTasks", fetchedTasks);
          setTasks(fetchedTasks);
          setHandoutContent(result.data.handout);
          setUnitTitle(result.data.unitTitle); // set the unit title
        } else {
          Alert.alert('error', 'failed to fetch tasks');
        }
      } catch (error: any) {
        Alert.alert('error', error.message || 'failed to fetch tasks');
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

  const renderTaskIcon = (task: Task, index: number, previousTask: Task | null) => {
    if (task.completed) {
      return (
        <View style={[styles.iconContainer, styles.completedIcon]}>
          <MaterialIcons name="check-circle" size={60} color="white" />
        </View>
      );
    } else if (index === 0 || (previousTask && previousTask.completed)) {
      return (
        <View style={[styles.iconContainer, styles.unlockedIcon]}>
          <MaterialIcons name="lock-open" size={60} color="white" />
        </View>
      );
    } else {
      return (
        <View style={[styles.iconContainer, styles.lockedIcon]}>
          <MaterialIcons name="lock" size={60} color="white" />
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
          <Button mode="contained" onPress={() => setModalVisible(false)}>close</Button>
        </View>
      </View>
    </Modal>
  );

  const JourneyStops = () => {
    const buttonSpacing = 40; // space between buttons
    const screenWidth = Dimensions.get('window').width;

    // calculate the offset for each task button
    const calculateOffset = (index: number) => {
      // update the index relative to the taskOffset
      index += taskOffset;

      const maxOffset = (screenWidth / 2); // maximum offset from center
      const offsetBase = 4;
      let offset = 0;

      // find the first number at or below index that is divisible evenly by offsetBase and determine the direction
      let lastCenter = index;
      while (lastCenter > 0 && lastCenter % offsetBase !== 0) {
        lastCenter--;
      }
      const inverse = (lastCenter / offsetBase) % 2 === 0;

      // determine the scaling factor to determine how much of the maxOffset to use
      let scalingFactor = (index - lastCenter) / (offsetBase / 2);
      if (index % offsetBase > Math.floor(offsetBase / 2)) {
        // calculate steps from midpoint
        let stepsFromMidpoint = index % offsetBase - Math.floor(offsetBase / 2);

        // calculate the scaling factor for this position inverse from the midpoint
        scalingFactor = Math.abs(index - (stepsFromMidpoint * 2) - lastCenter) / (offsetBase / 2);
      }

      console.log(index, scalingFactor)

      // calculate offset to create a zigzag pattern
      offset = inverse ? maxOffset : -maxOffset;

      return offset * scalingFactor;
    };

    // function to determine button colors and offset based on task and index
    const getButtonStyles = (task: any, index: number) => {
      // determine the button color based on task completion and previous task status
      const buttonColor = task.completed
        ? '#29C18C'
        : index === 0 || (index > 0 && tasks[index - 1].completed)
          ? theme.colors.secondary
          : '#808080';

      // determine the awesome button offset colors
      const offsetColor = index === 0 || (index > 0 && tasks[index - 1].completed) ? '#1E8F69' : '#5D5D5D';


      return [buttonColor, offsetColor];
    };

    return (
      <View style={styles.pathContainer}>
        {tasks.map((task, index) => {
          let c = getButtonStyles(task, index);
          return (
            <View key={task._id + index} style={[styles.taskButtonWrapper, { marginBottom: buttonSpacing, marginLeft: calculateOffset(index) }]}>
              <AwesomeButton
                borderRadius={100}
                height={100}
                width={100}
                paddingHorizontal={0}
                raiseLevel={10}
                backgroundColor={c[0]}
                backgroundActive={c[0]}
                backgroundPlaceholder={c[0]}
                backgroundProgress={c[0]}
                backgroundDarker={c[1]}
                disabled={!(index === 0 || (index > 0 && tasks[index - 1].completed))}
                onPress={() => {
                  if (index === 0 || (index > 0 && tasks[index - 1].completed)) {
                    handlePressTask(task);
                  }
                }}
              >
                {renderTaskIcon(task, index, index > 0 ? tasks[index - 1] : null)}
              </AwesomeButton>
              {/* <Text style={styles.taskName}>{task.name}</Text> */}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.unitHeader}>
            <Text style={styles.unitTitle}>
              {unitTitle}
            </Text>
          </View>
          {handoutVisible ? (
            <View style={styles.handoutContainer}>
              <ScrollView>
                <Text style={styles.handoutText}>{handoutContent}</Text>
              </ScrollView>
            </View>
          ) : (
            <JourneyStops />
          )}
        </View>
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
    alignItems: 'center',
  },
  taskButtonWrapper: {
    alignItems: 'center',
  },
  taskButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskName: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    backgroundColor: 'transparent',
  },
  completedIcon: {
    backgroundColor: 'transparent',
  },
  inProgressIcon: {
    backgroundColor: 'transparent',
  },
  lockedIcon: {
    backgroundColor: 'transparent',
  },
  unlockedIcon: {
    backgroundColor: 'transparent',
  },
  scrollView: {
    flexGrow: 1, // allows the scroll view to grow
  },
  contentContainer: {
    flex: 1, // takes up all available space
    alignItems: 'center',
    justifyContent: 'flex-start', // aligns content to the top
    paddingVertical: 5,
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