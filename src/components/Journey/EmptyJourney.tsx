/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Animated, {FadeInDown} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Config from 'react-native-config';

// Import language icons
import PythonLogo from '../../img/python-logo.svg';
import GoLogo from '../../img/Go-Logo-Blue.svg';
import JsLogo from '../../img/logo-javascript.svg';
import RustLogo from '../../img/logo-rust.svg';
import CppLogo from '../../img/Cpp_Logo.svg';
import CSharpLogo from '../../img/Logo_C_sharp.svg';

interface EmptyJourneyProps {
  language: string;
  onStartJourney: () => void;
  refetchJourneys: () => Promise<void>;
}

const {width} = Dimensions.get('window');

const EmptyJourney: React.FC<EmptyJourneyProps> = ({
  language,
  onStartJourney,
  refetchJourneys,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const API_URL = Config.API_URL;

  const handleSearchDetour = () => {
    // @ts-ignore
    navigation.navigate('Detour', {searchQuery: language});
  };

  const getLanguageIcon = () => {
    switch (language) {
      case 'Python':
        return <PythonLogo width={80} height={80} />;
      case 'Go':
        return <GoLogo width={80} height={80} />;
      case 'JavaScript':
        return <JsLogo width={80} height={80} />;
      case 'Rust':
        return <RustLogo width={80} height={80} />;
      case 'C++':
        return <CppLogo width={80} height={80} />;
      case 'C#':
        return <CSharpLogo width={80} height={80} />;
      default:
        return null;
    }
  };

  const handleStartIntroductoryJourney = async () => {
    const journeyMap = {
      'JavaScript': '1775630331836104704',
      'Python': '1769720326918242304',
      'Go': '1767257082752401408',
      'Rust': '1775923721366667264',
      'C#': 'example_id_csharp',
      'C++': 'example_id_cpp',
    };

    const unitId = journeyMap[language];

    if (!unitId) {
      console.error('No introductory journey found for', language);
      return;
    }

    try {
      console.log('Attempting to add unit:', unitId);
      const response = await fetch(`${API_URL}/api/journey/addUnitToMap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({unit_id: unitId}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();
      console.log('Server response:', res);

      if (res && res.success) {
        console.log('Introductory unit added successfully!');
        await refetchJourneys(); // Refetch journeys after successful addition
        onStartJourney(); // Call this after refetching to ensure the UI updates
      } else {
        console.error('Failed to add introductory unit to map:', res.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error adding introductory unit to map:', error);
      if (error.message.includes('Duplicate entry')) {
        console.log('Journey already exists. Refetching journeys...');
        await refetchJourneys(); // Refetch journeys if it's a duplicate entry error
        onStartJourney(); // Call this after refetching to ensure the UI updates
      }
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: 30,
      width: width * 0.9,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    iconContainer: {
      marginBottom: 20,
    },
    message: {
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 30,
      color: theme.colors.text,
      lineHeight: 24,
    },
    buttonContainer: {
      width: '100%',
      marginBottom: 15,
    },
    startButton: {
      backgroundColor: theme.colors.primary,
    },
    searchButton: {
      borderColor: theme.colors.primary,
      borderWidth: 1,
    },
    searchButtonText: {
      color: theme.colors.primary,
    },
    gradientBackground: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: '110%',
    },
    optionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 10,
    },
    optionDescription: {
      fontSize: 14,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 20,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.disabled,
      width: '100%',
      marginVertical: 20,
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          theme.colors.background,
          theme.colors.background,
          theme.colors.primary + '45',
        ]}
        style={styles.gradientBackground}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        locations={[0, 0.5, 1]}
      />
      <Animated.View
        entering={FadeInDown.duration(800).springify()}
        style={styles.card}>
        <View style={styles.iconContainer}>{getLanguageIcon()}</View>
        <Text style={styles.message}>
          It looks like you haven't started your Journey with {language}. Choose
          an option below:
        </Text>
        <Text style={styles.optionTitle}>New to {language}?</Text>
        <Text style={styles.optionDescription}>
          Start with our introductory {language} Journey, perfect for beginners.
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={styles.startButton}
            labelStyle={{fontSize: 16}}
            onPress={handleStartIntroductoryJourney}>
            Start Learning {language}
          </Button>
        </View>

        <View style={styles.divider} />

        <Text style={styles.optionTitle}>
          Already familiar with {language}?
        </Text>
        <Text style={styles.optionDescription}>
          Browse our entire selection of {language} Journeys. Recommended for
          those with some experience.
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            style={styles.searchButton}
            labelStyle={[styles.searchButtonText, {fontSize: 16}]}
            onPress={handleSearchDetour}>
            Browse {language} Journeys
          </Button>
        </View>
      </Animated.View>
    </View>
  );
};

export default EmptyJourney;
