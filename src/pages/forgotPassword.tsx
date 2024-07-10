import React, {useState, useRef} from 'react';
import {useTheme, TextInput} from 'react-native-paper';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert, Image,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import {useNavigation} from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const imageWidth = screenWidth * 0.1; // 15% of the screen width
const {width, height} = Dimensions.get('window');
import Config from 'react-native-config';

const ForgotPassword = () => {
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const navigation = useNavigation();
  const emailRef = useRef(null);

  const styles = StyleSheet.create({
    keyboardContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: '#1c3f30',
      borderRadius: 20,
      width: width, // 90% of screen width
      height: 340, // 25% of screen height
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      position: 'absolute',
      bottom: -16,
    },
    box: {
      backgroundColor: 'black',
      borderRadius: 10,
      width: width * 0.99, // 99% of screen width
      height: 340, // 70% of screen height
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    header: {
      fontSize: 24,
      marginBottom: 20,
      color: 'white',
    },
    input: {
      width: '80%',
      marginBottom: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 10,
    },
    inputLabel: {
      color: 'white',
      backgroundColor: 'transparent', // match this with your box background color
      paddingHorizontal: 4,
    },
    signInWith: {
      marginVertical: 20,
      fontSize: 16,
      color: 'white',
      alignSelf: 'center',
    },
    socialLogin: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    socialIcon: {
      width: 50,
      height: 50,
    },
    loginContainer: {
      flexDirection: 'row', // Align items in a column
      alignItems: 'even', // Align items in the center horizontally
      justifyContent: 'space-evenly',
      width: screenWidth * 0.8,
    },
    button: {
      padding: 10,
      alignItems: 'center', // Center content horizontally
      justifyContent: 'center', // Center content vertically
      marginVertical: 5, // Provides vertical spacing between buttons
    },
    innerContainer: {
      flexDirection: 'row', // Align images horizontally
      alignItems: 'center',
    },
    logo: {
      width: imageWidth,
      height: imageWidth, // This assumes the image is square. Adjust as needed.
      resizeMode: 'contain',
    },
    buttonExtra: {
      backgroundColor: '#4b9288', // A default blue color for button background
      padding: 10,
      borderRadius: 10, // Rounded corners
      alignItems: 'center',
      marginBottom: 10, // Space between buttons
      width: '70%',
    },
    firstButton: {
      paddingBottom: 50, // Extra padding at the bottom for the first button
    },
    buttonText: {
      color: 'white', // Text color for buttons
      fontSize: 16, // Font size for text
    },
    buttonTextExtra: {
      color: '#007BFF',
      fontSize: 16,
    },
    disabledButton: {
      backgroundColor: '#CCCCCC', // Grey out the button when it's disabled
    },
    accountText: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: screenWidth * 0.8,
    },
    externalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    externalBox: {
      justifyContent: 'center',
      alignItems: 'center',
      width: width > 1000 ? '35%' : '70%',
      borderRadius: 10,
      backgroundColor: '#fff', // Adjust according to your theme color
      paddingVertical: width > 1000 ? 15 : 30,
    },
    externalHeader: {
      fontSize: 20,
      marginBottom: 10,
    },
    externalInput: {
      width: '100%',
      height: 40,
      marginVertical: 10,
      borderWidth: 1,
      paddingHorizontal: 10,
    },
    externalButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.accent,
      padding: 10,
      borderRadius: 5,
      justifyContent: 'center',
      minHeight: 35,
      width: '50%',
      marginTop: 10,
    },
    externalButtonText: {
      color: theme.fonts.regular,
      marginLeft: 10,
    },
    externalSubText: {
      fontSize: 14,
      marginTop: 20,
    },
    footerText: {
      fontSize: 16,
      marginTop: 20,
      color: 'white',
    },
    helperText: {
      fontSize: 14,
      color: 'grey',
      marginBottom: 20,
    },
  });

  // Email validation function
  // eslint-disable-next-line @typescript-eslint/no-shadow
  function isValidEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const handleEmailChange = (newEmail: React.SetStateAction<string> | null) => {
    // @ts-ignore
    setEmail(newEmail);
    setIsEmailValid(isValidEmail(newEmail));
    // @ts-ignore
    emailRef.current = newEmail;
  };

  const API_URL = Config.API_URL;

  const sendResetValidation = async () => {
    const currentEmail = emailRef.current;

    if (!currentEmail || currentEmail.length < 5) {
      Alert.alert(
        'Invalid Credentials',
        'Please enter your email you used to sign up',
      );
      return;
    }

    try {
      console.log('url is: ', `${API_URL}/api/user/forgotPasswordValidation`);
      let response = await fetch(
        `${API_URL}/api/user/forgotPasswordValidation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email: currentEmail, url: 'www.gigo.dev'}),
        },
      );

      const responseText = await response.text(); // Get the response as text first

      try {
        let res = JSON.parse(responseText); // Then try parsing it as JSON
        console.log('Parsed JSON:', res); // Log the parsed JSON

        if (!res || !res.message) {
          Alert.alert(
            'Server Error',
            "We are unable to connect with the servers at this time. We're sorry for the inconvenience!",
          );
          return;
        }

        switch (res.message) {
          case 'must provide email for password recovery':
          case 'account not found':
            Alert.alert(
              'Account Not Found',
              "We could not find an account with that email address. Please try again, or create an account if you don't already have one.",
            );
            break;
          case 'failed to store reset token':
          case 'failed to send password reset email':
            Alert.alert(
              'Server Error',
              "We are having an issue at this time. We're sorry for the inconvenience! Please try again later.",
            );
            break;
          case 'Password reset email sent':
            Alert.alert(
              'Check your Email',
              'We have sent an email with instructions on how to reset your password.',
            );
            // @ts-ignore
            navigation.navigate('Login');
            break;
          default:
            Alert.alert('Error', 'An unexpected error occurred.');
            break;
        }
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError); // Log any errors during JSON parsing
      }
    } catch (error) {
      console.log('error is: ', error);
      Alert.alert(
        'Network Error',
        'Unable to connect. Check your network settings.',
      );
    }
  };

  const renderLabel = (label: string) => (
    <Text style={styles.inputLabel}>{label}</Text>
  );

  // @ts-ignore
  return (
    <KeyboardAvoidingView // Wrap your content with KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardContainer}
    >
      <Image source={require('../img/forgotPasswordJungle.png')} />
      <View style={styles.container}>
        <Text style={styles.header}>Forgot Password</Text>
        <TextInput
          label={renderLabel("Email")}
          value={email}
          onChangeText={handleEmailChange}
          style={styles.input}
          mode="flat"
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          textColor="white"
          cursorColor="white"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          theme={{ colors: { text: 'white', placeholder: 'rgba(255, 255, 255, 0.5)' } }}
        />
        <Text style={styles.helperText}>
          Please enter the email associated with your account
        </Text>
        <TouchableOpacity
          onPress={sendResetValidation}
          style={styles.buttonExtra}
          disabled={!isEmailValid}
          activeOpacity={0.7}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
            justifyContent: 'space-evenly',
            width: screenWidth * 0.65,
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={{
                color: '#4b9288',
                fontSize: 16,
                marginLeft: 10,
                lineHeight: 18,
              }}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text
              style={{
                color: '#4b9288',
                fontSize: 16,
                marginLeft: 10,
                lineHeight: 18,
              }}>
              Signup
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;
