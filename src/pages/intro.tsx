import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import GigoGorilla from '../img/logo.svg';
import HapticAwesomeButton from '../components/Buttons/HapticAwesomeButton';

const {width, height} = Dimensions.get('window');

const Intro = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'space-between', // change to space-between
      padding: 20,
    },
    topContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: 150,
      height: 150,
      resizeMode: 'contain',
      marginBottom: 10,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      // @ts-ignore
      color: theme.colors.primaryVariant,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 18,
      color: theme.colors.onBackground,
      marginBottom: 40,
      textAlign: 'center',
    },
    buttonContainer: {
      width: '100%',
      marginBottom: 20, // add some bottom margin
      paddingLeft: 20,
    },
    button: {
      marginBottom: 10,
      fontSize: 48,
    },
    buttonLabel: {
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <GigoGorilla style={styles.logo} />
        <Text style={styles.title}>GIGO DEV</Text>
        <Text style={styles.subtitle}>Learn to code fast</Text>
      </View>
      <View style={styles.buttonContainer}>
        <HapticAwesomeButton
          width={width * 0.8}
          height={50}
          backgroundColor={theme.colors.primary}
          // @ts-ignore
          backgroundDarker={theme.colors.primaryVariant}
          textColor={theme.colors.onPrimary}
          borderRadius={12}
          onPress={() => navigation.navigate('SignUp')}
          // @ts-ignore
          textFontFamily={theme.fonts.medium.fontFamily}
          style={styles.button}>
          GET STARTED
        </HapticAwesomeButton>
        <HapticAwesomeButton
          width={width * 0.8}
          height={50}
          backgroundColor="#D3D3D3"
          backgroundDarker="#A9A9A9"
          textColor="#333333"
          borderRadius={12}
          onPress={() => navigation.navigate('Login')}
          textFontFamily="Poppins-Medium"
          textSize={16}>
          I ALREADY HAVE AN ACCOUNT
        </HapticAwesomeButton>
      </View>
    </View>
  );
};

export default Intro;
