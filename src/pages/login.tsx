import React, {useState} from 'react';
import {TextInput, Button} from 'react-native-paper';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  KeyboardAvoidingView, // Add this import
  Platform, PixelRatio // Add this import
} from "react-native";
import HapticTouchableOpacity from '../components/Buttons/HapticTouchableOpacity';
// @ts-ignore
import googleLogo from '../components/Icons/login/google_g.png';
import {SvgXml} from 'react-native-svg';
import {useNavigation, useNavigationState} from '@react-navigation/native';
import {authorizeGithub, authorizeGoogle} from '../services/auth.js';
import {authorize} from '../../auth.js';
import {initialAuthStateUpdate, updateAuthState} from '../reducers/auth.ts';
import {useDispatch} from 'react-redux';
import LoginGithub from '../components/Login/Github/LoginGithub';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import Config from 'react-native-config';

const {width} = Dimensions.get('window');

const githubLogo = `
<svg width="100%" height="100%" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd"
          d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
          fill="#fff"/>
</svg>
`;

const screenWidth = Dimensions.get('window').width;

const API_URL = Config.API_URL;
const imageWidth = screenWidth * 0.1; // 15% of the screen width

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    box: {
      backgroundColor: '#1c3f30',
      borderRadius: 20,
      width: width, // 90% of screen width
      height: 460, // 25% of screen height
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      position: 'absolute',
      bottom: -16,
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
      justifyContent: 'space-evenly',
      width: screenWidth * 0.8,
    },
    button: {
      alignItems: 'center', // Center content horizontally
      justifyContent: 'center', // Center content vertically
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
      color: '#4b9288',
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
      backgroundColor: '#1c3f30',
      borderRadius: 20,
      width: width, // 90% of screen width
      height: 300, // 25% of screen height
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      position: 'absolute',
      bottom: -16,
    },
    externalHeader: {
      fontSize: 24,
      marginBottom: 20,
      color: 'white',
    },
    externalInput: {
      width: '80%',
      height: 30,
      marginBottom: 20,
      borderRadius: 10,
      borderWidth: 1,
      padding: 10,
      color: 'white',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderColor: 'gray',
    },
    externalButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderRadius: 5,
      justifyContent: 'center',
      minHeight: 35,
      width: '50%',
      marginTop: 10,
      backgroundColor: '#4b9288', // A default blue color for button background
    },
    externalButtonText: {
      color: 'white', // Text color for buttons
      fontSize: 16, // Font size for text
    },
    externalSubText: {
      fontSize: 14,
      marginTop: 20,
      color: 'white',
    },
  });
  // Assuming the use of hooks for state management
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [external, setExternal] = React.useState(false);
  const [externalLogin, setExternalLogin] = React.useState('');
  const [externalToken, setExternalToken] = React.useState('');
  const [showPass, setShowPass] = React.useState(false);
  const [ghConfirm, setGhConfirm] = React.useState(false);
  const [windowHeight, setWindowHeight] = useState(
    Dimensions.get('screen').height,
  );
  console.log("dimension: ", Dimensions.get('screen').height)
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get('window').width,
  );

  const windowHeightTest = Dimensions.get('screen').height; // Get screen height in DP
  const pixelHeight = PixelRatio.getPixelSizeForLayoutSize(windowHeightTest); // Convert DP to pixels
  console.log(pixelHeight);

  const startGoogle = async () => {
    const userInfo = await GoogleSignin.signIn();
    setExternal(true);
    // @ts-ignore
    setExternalToken(userInfo.idToken);
    setExternalLogin('Google');
    //       const auth = await authorizeGoogle(userInfo.idToken); // Adjust this function to your backend
    //     googleSignIn();
  };

  const googleSignIn = async () => {
    setLoading(true);
    try {
      //           const userInfo = await GoogleSignin.signIn();
      const res = await authorizeGoogle(externalToken, password); // Adjust this function to your backend
      let auth = res.data;
      let token = res.token;

      if (auth === 'User not found') {
        Alert.alert(
          'Login Failed',
          'This Google account is not linked with our service. Try logging in with the same email or sign up.',
        );
        setLoading(false);
        return;
      }

      if (auth.user !== undefined) {
        let authState = {
          ...initialAuthStateUpdate, // Define this according to your auth state structure
          authenticated: true,
          token: token,
          ...auth,
        };
        dispatch(updateAuthState(authState));
        // @ts-ignore
        navigation.navigate('JourneyMain');
      } else {
        Alert.alert('Login Failed', 'The provided credentials did not match.');
      }
    } catch (error) {
      Alert.alert('Login Error', 'Failed to authenticate with Google.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      // Alert.alert('FCM Token', fcmToken); // Display the token for testing purposes
      // Save the token to your backend if needed
      return fcmToken;
    } else {
      console.log('Failed to get FCM token');
    }
  };

  const currentRouteName = useNavigationState(
    state => state.routes[state.index].name,
  );

  const onSuccessGithub = async (gh: {code: string}) => {
    if (currentRouteName === 'SignUp') {
      return;
    }

    setExternalToken(gh.code);
    setExternal(true);
    setExternalLogin('Github');
    setLoading(true);
    let token = await getFcmToken();

    try {
      let res = await fetch(`${API_URL}/api/auth/loginWithGithub`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({external_auth: gh.code, fcm_token: token}),
      });

      // @ts-ignore
      if (res.auth === false) {
        Alert.alert('Login Error', 'Incorrect credentials, please try again.');
        setLoading(false);
        return;
      }

      setGhConfirm(true);
    } catch (error) {
      Alert.alert('Network Error', 'Failed to communicate with server.');
    }

    setLoading(false);
  };

  const githubConfirm = async () => {
    if (!ghConfirm) {
      Alert.alert('Error', 'BAD');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Initial API call to confirm GitHub login
      let res = await fetch(`${API_URL}/api/auth/confirmLoginWithGithub`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({password: password}),
      });

      // Extract the token from the set-cookie header
      const setCookieHeader = res.headers.get('set-cookie');
      let gigoAuthToken = '';

      if (setCookieHeader) {
        const tokenMatch = setCookieHeader.match(/gigoAuthToken=([^;]+)/);
        if (tokenMatch && tokenMatch.length > 1) {
          gigoAuthToken = tokenMatch[1];
        } else {
          console.error('gigoAuthToken not found in set-cookie header.');
        }
      } else {
        console.error('Set-Cookie header not found.');
      }

      // Authorize GitHub and get the response
      const resAuth = await authorizeGithub(password);

      const xpValue = res.xp !== undefined ? res.xp : 0;
      await AsyncStorage.setItem('loginXP', JSON.stringify(xpValue));

      // If resAuth is not a standard response object, handle it differently
      let auth: any;
      if (typeof resAuth.json === 'function') {
        auth = await resAuth.json(); // Standard fetch response
      } else {
        auth = resAuth; // Directly use resAuth if it's not a fetch Response
      }

      // Populate the authState object with data from the response
      const authState = {
        ...initialAuthStateUpdate,
        authenticated: true,
        token: gigoAuthToken, // Use the extracted token
        expiration: auth.exp,
        id: auth.user,
        role: auth.user_status,
        email: auth.email,
        phone: auth.phone,
        userName: auth.user_name,
        thumbnail: auth.thumbnail,
        backgroundColor: auth.color_palette,
        backgroundName: auth.name,
        backgroundRenderInFront: auth.render_in_front,
        exclusiveContent: auth.exclusive_account,
        exclusiveAgreement: auth.exclusive_agreement,
        tier: auth.tier,
        inTrial: auth.in_trial,
        alreadyCancelled: auth.already_cancelled,
        hasPaymentInfo: auth.has_payment_info,
        hasSubscription: auth.has_subscription,
        usedFreeTrial: auth.used_free_trial,
      };

      dispatch(updateAuthState(authState));

      setTimeout(() => {
        // @ts-ignore
        navigation.navigate('JourneyMain');
      }, 1000);
    } catch (error) {
      Alert.alert('Login Error', 'An error occurred during the login process.');
    } finally {
      setLoading(false);
    }
  };

  const onFailureGithub = () => {
    Alert.alert('Login Failed', 'GitHub login failed. Please try again.');
  };

  const loginFunction = async () => {
    setLoading(true);

    try {
      let res = await authorize(username, password);
      let auth = res.data;
      let token = res.token;

      if (auth !== undefined && auth.user !== undefined) {
        let authState = {
          ...initialAuthStateUpdate,
          token: token,
          authenticated: true,
          expiration: auth.exp,
          id: auth.user,
          role: auth.user_status,
          email: auth.email,
          phone: auth.phone,
          userName: auth.user_name,
          thumbnail: auth.thumbnail,
          backgroundColor: auth.color_palette,
          backgroundName: auth.name,
          backgroundRenderInFront: auth.render_in_front,
          exclusiveContent: auth.exclusive_account,
          exclusiveAgreement: auth.exclusive_agreement,
          tutorialState: auth.tutorials,
          tier: auth.tier,
          inTrial: auth.in_trial,
          alreadyCancelled: auth.already_cancelled,
          hasPaymentInfo: auth.has_payment_info,
          hasSubscription: auth.has_subscription,
          usedFreeTrial: auth.used_free_trial,
        };

        dispatch(updateAuthState(authState));

        setLoading(false);
        // @ts-ignore
        navigation.navigate('JourneyMain');
        return;
      }

      if (res.includes('Too many failed attempts')) {
        Alert.alert('Login failed.', res);
        setLoading(false);
      } else {
        let attemptsRemaining = res[0]; // Assuming auth[0] contains the attempts count
        Alert.alert(
          'Login Failed',
          `The provided username and password did not match. You have ${attemptsRemaining} attempts remaining.`,
        );
        setLoading(false);
      }
    } catch (error) {
      Alert.alert('Login Error', 'unable to connect to server');
      setLoading(false);
    }
  };

  const renderExternal = () => {
    // @ts-ignore
    return (
      <View style={styles.externalBox}>
        <Text style={styles.externalHeader}>Enter Password</Text>
        <TextInput
          label={renderLabel('Password')}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={!showPass}
          style={styles.input}
          mode="flat"
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          textColor="white"
          cursorColor="white"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          theme={{
            colors: {text: 'white', placeholder: 'rgba(255, 255, 255, 0.5)'},
          }}
          right={
            <TextInput.Icon
              icon={showPass ? 'eye-off' : 'eye'}
              onPress={() => setShowPass(!showPass)}
              color="white"
            />
          }
          onSubmitEditing={() => {
            externalLogin === 'Google' ? googleSignIn() : githubConfirm();
          }}
        />
        {loading ? (
          <View style={styles.externalButton}>
            <Text style={styles.externalButtonText}>Login</Text>
          </View>
        ) : (
          <HapticTouchableOpacity
            style={styles.externalButton}
            onPress={() => {
              externalLogin === 'Google' ? googleSignIn() : githubConfirm();
            }}>
            <Text style={styles.externalButtonText}>Login</Text>
          </HapticTouchableOpacity>
        )}
        <Text style={styles.externalSubText}>
          Haven't linked your account yet?
        </Text>
        <Button
          onPress={() =>
            navigation.navigate(
              //@ts-ignore
              'SignUp',
              {
                forward: encodeURIComponent(''),
              },
            )
          }
          //@ts-ignore
          title="Sign Up">
          <Text style={{color: '#4b9288'}}>Sign Up</Text>
        </Button>
      </View>
    );
  };

  const renderLabel = (label: string) => (
    <Text style={styles.inputLabel}>{label}</Text>
  );

  let renderLogin = () => {
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
      <View style={styles.box}>
        <Text style={styles.header}>Sign In</Text>
        <TextInput
          label={renderLabel('Username')}
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          mode="flat"
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          textColor="white"
          cursorColor="white"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          theme={{
            colors: {text: 'white', placeholder: 'rgba(255, 255, 255, 0.5)'},
          }}
        />
        <TextInput
          label={renderLabel('Password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPass}
          style={styles.input}
          mode="flat"
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          textColor="white"
          cursorColor="white"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          theme={{
            colors: {text: 'white', placeholder: 'rgba(255, 255, 255, 0.5)'},
          }}
          right={
            <TextInput.Icon
              icon={showPass ? 'eye-off' : 'eye'}
              onPress={() => setShowPass(!showPass)}
              color="white"
            />
          }
        />
        <HapticTouchableOpacity
          onPress={loginFunction}
          disabled={loading}
          style={[styles.buttonExtra, loading ? styles.disabledButton : null]}
          activeOpacity={0.7}>
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : 'Login'}
          </Text>
        </HapticTouchableOpacity>
        <View style={styles.accountText}>
          <HapticTouchableOpacity
            onPress={() =>
              navigation.navigate(
                //@ts-ignore
                'ForgotPassword',
              )
            }>
            <Text style={styles.buttonTextExtra}>Forgot Password</Text>
          </HapticTouchableOpacity>

          <HapticTouchableOpacity
            onPress={() =>
              navigation.navigate(
                //@ts-ignore
                'SignUp',
              )
            }>
            <Text style={styles.buttonTextExtra}>No Account? Register</Text>
          </HapticTouchableOpacity>
        </View>
        <Text style={styles.signInWith}>or sign in with linked account:</Text>
        <View style={styles.loginContainer}>
          <HapticTouchableOpacity onPress={startGoogle} style={styles.button}>
            <View style={styles.innerContainer}>
              <Image
                //@ts-ignore
                style={styles.logo}
                source={googleLogo}
              />
            </View>
          </HapticTouchableOpacity>
          <LoginGithub
            //@ts-ignore
            color={'primary'}
            sx={{
              // width: window.innerWidth > 1000 ? '7vw' : '25vw',
              justifyContent: 'center',
              padding: '15px',
            }}
            clientId="Ov23liWncdWCkys9HUil"
            // this redirect URI is for production, testing on dev will not work
            redirectUri={'gigoapp://callback'}
            onSuccess={onSuccessGithub}
            containerHeight={windowHeight * 1.80} // Pass the height
            containerWidth={windowWidth} // Pass the width
            onFailure={onFailureGithub}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <SvgXml xml={githubLogo} width={imageWidth} height={imageWidth} />
            </View>
          </LoginGithub>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView // Wrap your content with KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <Image source={require('../img/loginJungle.png')} />
      {external ? renderExternal() : renderLogin()}
    </KeyboardAvoidingView>
  );
};

export default Login;
