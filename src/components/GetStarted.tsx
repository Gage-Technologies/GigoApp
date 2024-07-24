import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Config from 'react-native-config';

import PythonLogo from '../img/python-logo.svg';
import GoLogo from '../img/Go-Logo-Blue.svg';
import JsLogo from '../img/logo-javascript.svg';
import RustLogo from '../img/logo-rust.svg';
import CppLogo from '../img/Cpp_Logo.svg';
import CSharpLogo from '../img/Logo_C_sharp.svg';

const GetStarted = ({getTasks}) => {
  const [selectedJourney, setSelectedJourney] = useState('');
  const [firstProject, setFirstProject] = useState('');
  const [loadingMapData, setLoadingMapData] = useState(false);
  const navigation = useNavigation();
  const API_URL = Config.API_URL;

  const handleStartJourney = async () => {
    setLoadingMapData(true);

    try {
      const response = await fetch(`${API_URL}/api/journey/addUnitToMap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({unit_id: firstProject}),
      });

      const res = await response.json();

      if (res && res.success) {
        console.log('Unit added successfully!');
        await getTasks();
        setLoadingMapData(false);
      } else {
        console.error('Failed to add unit to map');
        setLoadingMapData(false);
      }
    } catch (error) {
      console.error('Failed to add unit to map', error);
      setLoadingMapData(false);
    }
  };

  const journeys = {
    python: {
      title: 'Python',
      description:
        'Python is versatile and easy to learn, making it great for beginners and useful in areas like web development, data analysis, and automation.',
      id: '1769720326918242304',
      favorite: true,
      icon: <PythonLogo style={styles.logo} width={50} height={50} />,
    },
    golang: {
      title: 'Golang',
      description:
        'Designed by Google, Go is fast and efficient, perfect for building reliable and scalable software systems like servers and databases.',
      id: '1767257082752401408',
      favorite: false,
      icon: <GoLogo style={styles.logo} width={50} height={50} />,
    },
    js: {
      title: 'JavaScript',
      description:
        'JavaScript is essential for creating interactive websites and is widely used because it runs in any web browser, making it indispensable for web development.',
      id: '1775630331836104704',
      favorite: false,
      icon: <JsLogo style={styles.logo} width={50} height={50} />,
    },
    rust: {
      title: 'Rust',
      description:
        'Rust is known for its safety and speed, ideal for programming where performance and reliability are critical, such as in operating systems and game engines.',
      id: '1775923721366667264',
      favorite: false,
      icon: <RustLogo style={styles.logo} width={50} height={50} />,
    },
    csharp: {
      title: 'C#',
      description:
        'C# is powerful for building a variety of applications, especially for Windows platforms, making it a go-to for desktop software, games, and mobile apps.',
      id: 'example_id_csharp',
      favorite: false,
      icon: <CSharpLogo style={styles.logo} width={50} height={50} />,
    },
    cpp: {
      title: 'C++',
      description:
        'C++ is highly efficient and versatile, favored for applications where speed and resource control are critical, such as video games or real-time systems.',
      id: 'example_id_cpp',
      favorite: false,
      icon: <CppLogo style={styles.logo} width={50} height={50} />,
    },
  };

  const selectJourney = (journeyKey, id) => {
    setSelectedJourney(journeyKey);
    setFirstProject(id);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Choose Your Lane</Text>
      <Text style={styles.description}>
        Journeys are a structured way to learn programming. Select the starting
        path you would like to take in your Journey. You can always take a
        detour at any time to switch it up.
      </Text>
      <View style={styles.journeysContainer}>
        {Object.entries(journeys).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            style={styles.journeyButton}
            onPress={() => selectJourney(key, value.id)}>
            {value.icon}
            <Text style={styles.journeyTitle}>{value.title}</Text>
            {value.favorite && (
              <Text style={styles.favorite}>Most Popular</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
      {selectedJourney && (
        <View style={styles.selectedJourneyContainer}>
          <Text style={styles.journeyDescription}>
            {journeys[selectedJourney].description}
          </Text>
          <Button
            mode="contained"
            onPress={handleStartJourney}
            loading={loadingMapData}
            disabled={loadingMapData}
            style={styles.startButton}>
            Start Journey
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'start',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    marginBottom: 20,
  },
  journeysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  journeyButton: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 20,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    width: '45%',
  },
  journeyTitle: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
  },
  favorite: {
    marginTop: 5,
    color: '#ffd700',
    fontSize: 12,
  },
  selectedJourneyContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  journeyDescription: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  startButton: {
    backgroundColor: '#29C18C',
  },
  logo: {
    width: 50,
    height: 50,
  },
});

export default GetStarted;
