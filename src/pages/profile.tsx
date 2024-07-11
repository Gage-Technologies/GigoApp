import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const projects: Project[] = [
  {id: '1', title: 'Typing Tester', image: 'path_to_image'},
  {id: '2', title: 'Rock Paper Scissors', image: 'path_to_image'},
  {id: '3', title: 'Tic Tac Toe', image: 'path_to_image'},
  {id: '4', title: 'Budget Tracker', image: 'path_to_image'},
];

///this page is not used- therefore not finished

const Profile: React.FC = () => {
  const apiLoad = async () => {
    let userData = await fetch(`${API_URL}/api/user/profilePage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({author_id: ''}),
    });

    if (!userData.ok) {
      console.log('user data is: ', userData);
      console.log('user id: ', userId);
      throw new Error('Network response was not ok');
    }

    const resUser = await userData.json();
    console.log('res here is: ', res);

    if (resUser !== undefined && resUser.user !== undefined) {
      setUserData(resUser.user);
    }
  };

  const renderProject = ({item}: {item: Project}) => (
    <View style={styles.projectCard}>
      <Image source={{uri: item.image}} style={styles.projectImage} />
      <Text style={styles.projectTitle}>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={{uri: 'path_to_avatar'}} style={styles.avatar} />
        <Text style={styles.name}>Megan</Text>
        <Text style={styles.renown}>Renown 10</Text>
        <Text style={styles.level}>Level 10</Text>
        <Text style={styles.subscriber}>Subscribers: 0</Text>
      </View>
      <FlatList
        data={projects}
        renderItem={renderProject}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.projectsList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e1e1e',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 4,
  },
  renown: {
    fontSize: 18,
    color: '#fff',
  },
  level: {
    fontSize: 14,
    color: '#aaa',
  },
  subscriber: {
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
  },
  projectsList: {
    padding: 16,
  },
  projectCard: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  projectImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 18,
    color: '#fff',
  },
});

export default Profile;
