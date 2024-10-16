import React, {useEffect, useState} from 'react';
import {TextInput, Button} from 'react-native-paper';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Linking,
  TouchableOpacity,
} from 'react-native';
import HapticTouchableOpacity from '../components/Buttons/HapticTouchableOpacity';
// @ts-ignore
import googleLogo from '../components/Icons/login/google_g.png';
import {SvgXml} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import debounce from 'lodash/debounce';
import CreateGithub from '../components/Login/Github/CreateGithub.tsx';
import profilePic from '../components/Avatar/profile-pic.svg';
import Config from 'react-native-config';
import {useDispatch} from 'react-redux';
import {authorizeGoogle} from '../services/auth.js';
import {authorize, authorizeGithub} from '../../auth.js';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {initialAuthStateUpdate, updateAuthState} from '../reducers/auth.ts';
import fetchWithUpload from '../services/api-call.tsx';

const screenWidth = Dimensions.get('window').width;
const imageWidth = screenWidth * 0.1; // 15% of the screen width
const {width, height} = Dimensions.get('window');
import moment from 'moment-timezone';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {theme} from '../theme.ts';
import testProfilePic from '../components/Login/testpfp.ts';
import LoginGithub from '../components/Login/Github/LoginGithub.tsx';
import HapticAwesomeButton from '../components/Buttons/HapticAwesomeButton.tsx';

const API_URL = Config.API_URL;

interface TimezoneOption {
  value: string;
  label: string;
}

const formatTz = (tz: string): TimezoneOption => {
  const tzOffset = moment.tz(tz).format('Z');

  return {
    label: `${tz} (GMT${tzOffset})`,
    value: tz,
  };
};

const githubLogo = `
<svg width="100%" height="100%" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd"
          d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
          fill="#fff"/>
</svg>
`;

const CreateNewAccount = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [external, setExternal] = React.useState(false);
  const [externalLogin, setExternalLogin] = React.useState('');
  const [externalToken, setExternalToken] = React.useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [missingUser, setMissingUser] = React.useState<boolean>(false);
  const [invalidUsername, setInvalidUsername] = React.useState<boolean>(false);
  const [missingEmail, setMissingEmail] = React.useState<boolean>(false);
  const [missingPhone, setMissingPhone] = React.useState<boolean>(false);
  const [missingPassword, setMissingPassword] = React.useState<boolean>(false);
  const [missingConfirm, setMissingConfirm] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);
  const [timezone, setTimezone] = React.useState<TimezoneOption | null>(
    formatTz(moment.tz.guess()),
  );
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [forcePass, setForcePass] = React.useState<boolean>(false);
  const [step, setStep] = React.useState(0);
  const [showPass, setShowPass] = React.useState(false);
  const [Attributes, setAttributes] = useState({
    topType: 'Hijab',
    accessoriesType: 'Blank',
    avatarRef: {},
    hairColor: 'BrownDark',
    facialHairType: 'Blank',
    clotheType: 'ShirtCrewNeck',
    clotheColor: 'PastelOrange',
    eyeType: 'Surprised',
    eyebrowType: 'UpDown',
    mouthType: 'Serious',
    avatarStyle: 'Circle',
    skinColor: 'Pale',
  });
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [creationStep, setCreationStep] = React.useState(0);

  const [windowHeight, setWindowHeight] = useState(
    Dimensions.get('window').height,
  );
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get('window').width,
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#111111',
    },
    content: {
      flex: 1,
      padding: 20,
      justifyContent: 'space-between',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    closeButton: {
      padding: 10,
    },
    closeIcon: {
      color: '#FFFFFF',
      fontSize: 24,
    },
    inputContainer: {
      marginBottom: 20,
    },
    input: {
      backgroundColor: '#333333',
      borderRadius: 10,
      padding: 4,
      marginBottom: 10,
      color: '#FFFFFF',
    },
    createButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
      marginBottom: 20,
    },
    createButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    socialLoginContainer: {
      marginTop: 20,
    },
    socialLoginTitle: {
      color: '#FFFFFF',
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 10,
    },
    socialButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
    },
    socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#333333',
      borderRadius: 10,
      padding: 15,
      marginHorizontal: 10,
    },
    socialButtonText: {
      color: '#FFFFFF',
      marginLeft: 10,
    },
    loginText: {
      color: '#FFFFFF',
      fontSize: 14,
      textAlign: 'center',
      marginTop: 20,
    },
    loginLink: {
      color: theme.colors.primary,
    },
    termsText: {
      color: '#888888',
      fontSize: 12,
      textAlign: 'center',
      marginTop: 20,
    },
    // styles for renderExternal
    externalBox: {
      justifyContent: 'center',
      alignItems: 'center',
      width: width > 1000 ? '35%' : '70%',
      borderRadius: 10,
      backgroundColor: '#333333',
      paddingVertical: width > 1000 ? 15 : 30,
      marginTop: 20,
    },
    externalHeader: {
      fontSize: 20,
      marginBottom: 10,
      color: '#FFFFFF',
    },
    externalInput: {
      width: '80%',
      height: 40,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: '#FFFFFF',
      paddingHorizontal: 10,
      color: '#FFFFFF',
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
      backgroundColor: theme.colors.primary,
    },
    externalButtonText: {
      color: '#FFFFFF',
      marginLeft: 10,
    },
    externalSubText: {
      fontSize: 14,
      marginTop: 20,
      color: '#FFFFFF',
    },
  });

  const onSuccessGoogle = async (usr: React.SetStateAction<string> | null) => {
    setExternal(true);
    // @ts-ignore
    setExternalToken(usr);
    setExternalLogin('Google');
  };

  const onSuccessGithubCreate = async (gh: {code: string}) => {
    setExternal(true);

    setExternalToken(gh.code);
    setExternalLogin('Github');
  };

  const createLogin = async () => {
    let auth = await authorize(username, password);
    // @ts-ignore
    if (auth.user !== undefined) {
      let authState = Object.assign({}, initialAuthStateUpdate);
      authState.authenticated = true;
      // @ts-ignore
      authState.expiration = auth.exp;
      // @ts-ignore
      authState.id = auth.user;
      // @ts-ignore
      authState.role = auth.user_status;
      authState.email = auth.email;
      authState.phone = auth.phone;
      authState.userName = auth.user_name;
      authState.thumbnail = auth.thumbnail;
      authState.exclusiveContent = auth.exclusive_account;
      authState.exclusiveAgreement = auth.exclusive_agreement;
      // authState.tutorialState = DefaultTutorialState;
      dispatch(updateAuthState(authState));

      await sleep(1000);
    } else {
      if (AsyncStorage.getItem('alive') === null) {
        //@ts-ignore
        swal('Sorry, we failed to log you in, please try again on login page');
      }
    }
  };

  const githubCreate = async () => {
    setLoading(true);

    try {
      let token = await getFcmToken();

      const svgString = profilePic;
      //@ts-ignore
      const svgBlob = await svgToBlob(svgString);

      let params = {
        external_auth: externalToken,
        password: password,
        start_user_info: {
          usage: 'I want to learn how to code by doing really cool projects.',
          proficiency: 'Beginner',
          tags: 'python,javascript,golang,web development,game development,machine learning,artificial intelligence',
          preferred_language: 'Python, Javascript, Golang, Typescript',
        },
        timezone: timezone ? timezone.value : 'America/Chicago',
        avatar_settings: {
          topType: Attributes.topType,
          accessoriesType: Attributes.accessoriesType,
          hairColor: Attributes.hairColor,
          facialHairType: Attributes.facialHairType,
          clotheType: Attributes.clotheType,
          clotheColor: Attributes.clotheColor,
          eyeType: Attributes.eyeType,
          eyebrowType: Attributes.eyebrowType,
          mouthType: Attributes.mouthType,
          avatarStyle: Attributes.avatarStyle,
          skinColor: Attributes.skinColor,
        },
        fcm_token: token,
      };
      let create = await fetchWithUpload(
        `${API_URL}/api/user/createNewGithubUser`,
        svgBlob,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
          credentials: 'include',
        },
        async (res: any) => {
          if (res.message !== 'Github User Added.') {
            Alert.alert('Something went wrong here...', res.message);
            return;
          }

          if (res === undefined) {
            Alert.alert('Network Error', 'Unable to connect to the server.');
            return;
          }

          if (res.message === 'Github User Added.') {
            try {
              const authRes = await authorizeGithub(password);

              // Extract and structure the authorization data
              //@ts-ignore
              const {data: authData, token: gigoAuthToken} = authRes;

              if (authData && authData.user) {
                let authState = Object.assign({}, initialAuthStateUpdate);
                authState.authenticated = true;
                authState.token = gigoAuthToken; // Use the token from the auth response
                authState.expiration = authData.exp;
                authState.id = authData.user;
                authState.role = authData.user_status;
                authState.email = authData.email;
                authState.phone = authData.phone;
                authState.userName = authData.user_name;
                authState.thumbnail = authData.thumbnail;
                authState.exclusiveContent = authData.exclusive_account;
                authState.exclusiveAgreement = authData.exclusive_agreement;
                authState.tier = authData.tier;
                authState.inTrial = authData.in_trial;
                authState.alreadyCancelled = authData.already_cancelled;
                authState.hasPaymentInfo = authData.has_payment_info;
                authState.hasSubscription = authData.has_subscription;
                authState.usedFreeTrial = authData.used_free_trial;

                dispatch(updateAuthState(authState));

                // Navigate after a short delay to ensure state is updated
                sleep(1000).then(() => {
                  //@ts-ignore
                  navigation.navigate('JourneyMain');
                });
                setLoading(false);
              } else {
                Alert.alert(
                  'Login Failed',
                  'Sorry, we failed to log you in. Please try again on the login page.',
                );
              }
              setLoading(false);
            } catch (error) {
              //@ts-ignore
              Alert.alert(
                'Login Error',
                'An error occurred during the authorization process.',
              );
              setLoading(false);
            }
          }
        },
      );
    } catch (error) {
      Alert.alert(
        'Login Error',
        'An error occurred during the GitHub user creation process.',
      );
      setLoading(false);
    }
  };

  const onFailureGithub = () => {
    Alert.alert('Login Failed', 'GitHub login failed. Please try again.');
  };

  const googleSignUp = async () => {
    setLoading(true);
    try {
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.idToken;

      onSuccessGoogle(idToken);
    } catch (error) {
      Alert.alert('Sign-Up Error', 'Failed to authenticate with Google.');
      console.error(error);
      setLoading(false);
    }
  };

  const sleep = (milliseconds: number | undefined): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, milliseconds);
    });
  };

  const googleCreate = async () => {
    setLoading(true);
    let token = await getFcmToken();

    if (password !== confirmPass || password.length < 5) {
      Alert.alert('Error', 'Passwords do not match or too short');
      setLoading(false);
      return;
    }

    if (!timezone) {
      Alert.alert('Error', 'Timezone must be filled');
      setLoading(false);
      return;
    }

    const svgString = profilePic;

    let params = {
      external_auth: externalToken,
      password: password,
      start_user_info: {
        usage: 'I want to learn how to code by doing really cool projects.',
        proficiency: 'Beginner',
        tags: 'python,javascript,golang,web development,game development,machine learning,artificial intelligence',
        preferred_language: 'Python, Javascript, Golang, Typescript',
      },
      timezone: timezone ? timezone.value : 'America/Chicago',
      avatar_settings: {
        topType: Attributes.topType,
        accessoriesType: Attributes.accessoriesType,
        hairColor: Attributes.hairColor,
        facialHairType: Attributes.facialHairType,
        clotheType: Attributes.clotheType,
        clotheColor: Attributes.clotheColor,
        eyeType: Attributes.eyeType,
        eyebrowType: Attributes.eyebrowType,
        mouthType: Attributes.mouthType,
        avatarStyle: Attributes.avatarStyle,
        skinColor: Attributes.skinColor,
      },
      fcm_token: token,
    };

    try {
      //@ts-ignore
      const svgBlob = await svgToBlob(svgString);
      await fetchWithUpload(
        `${API_URL}/api/user/createNewGoogleUserApp`,
        svgBlob,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
          credentials: 'include',
        },
        (res: any) => {
          if (res.message !== 'Google User Added.') {
            Alert.alert('Something went wrong here...', res.message);
          }

          if (res === undefined) {
            Alert.alert('Network Error', 'Unable to connect to the server.');
          }

          if (res.message === 'Google User Added.') {
            authorizeGoogle(externalToken, password).then(auth => {
              // @ts-ignore
              if (auth.user !== undefined) {
                let authState = Object.assign({}, initialAuthStateUpdate);
                authState.authenticated = true;
                // @ts-ignore
                authState.expiration = auth.exp;
                // @ts-ignore
                authState.id = auth.user;
                // @ts-ignore
                authState.role = auth.user_status;
                authState.email = auth.email;
                authState.phone = auth.phone;
                authState.userName = auth.user_name;
                authState.thumbnail = auth.thumbnail;
                authState.backgroundColor = auth.color_palette;
                authState.backgroundName = auth.name;
                authState.backgroundRenderInFront = auth.render_in_front;
                authState.exclusiveContent = auth.exclusive_account;
                authState.exclusiveAgreement = auth.exclusive_agreement;
                //@ts-ignore
                authState.tutorialState = auth.tutorials as TutorialState;
                authState.tier = auth.tier;
                authState.inTrial = auth.in_trial;
                authState.alreadyCancelled = auth.already_cancelled;
                authState.hasPaymentInfo = auth.has_payment_info;
                authState.hasSubscription = auth.has_subscription;
                authState.usedFreeTrial = auth.used_free_trial;
                dispatch(updateAuthState(authState));

                // this makes sure the dispatch occurs
                sleep(1000).then(() => {
                  navigation.navigate(
                    //@ts-ignore
                    'JourneyMain',
                  );
                });
                setLoading(false);
              } else {
                Alert.alert(
                  'Sorry, we failed to log you in, please try again on login page.',
                );
                setLoading(false);
              }
            });
          }
        },
      );
    } catch (error) {
      Alert.alert('Error', 'Network request failed');
      setLoading(false);
    }
  };

  function hasLetters(str: string): boolean {
    return /[a-zA-Z]/.test(str);
  }

  const verifyEmail = async (emailParam: string) => {
    if (emailParam === '') {
      Alert.alert('You must input a valid email', '', [
        {text: 'OK', style: 'cancel'},
      ]);
      return false; // Directly return false when emailParam is empty
    }

    try {
      let res = await fetch(`${API_URL}/api/email/verify`, {
        // Corrected template string
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: emailParam}),
      });
      res = await res.json();

      // @ts-ignore
      if (res.valid === undefined) {
        Alert.alert(
          'An unexpected error has occurred',
          "We're sorry, we'll get right on that!",
          [{text: 'OK', style: 'cancel'}],
        );
        return false;
      } else {
        // @ts-ignore
        if (res.valid === false) {
          Alert.alert(
            'Invalid Email Address',
            'Please enter a valid email address and retry',
            [{text: 'OK', style: 'cancel'}],
          );
          return false;
          //@ts-ignore
        } else if (res.valid === true) {
          return true; // Ensure returning true when valid
        }
      }
    } catch (error) {
      Alert.alert('Network Error', 'Unable to validate email', [
        {text: 'OK', style: 'cancel'},
      ]);
      setLoading(false);
      return false;
    }
  };

  const validateUser = async () => {
    setLoading(true);

    let missingFields = [];
    if (username === '') {
      setMissingUser(true);
      missingFields.push('Username');
    }
    if (email === '') {
      setMissingEmail(true);
      missingFields.push('Email');
    }
    if (password === '') {
      setMissingPassword(true);
      missingFields.push('Password');
    }
    if (confirmPass === '') {
      setMissingConfirm(true);
      missingFields.push('Confirm Password');
    }
    if (missingFields.length > 0) {
      setLoading(false);
      Alert.alert(
        'Please fill in the following fields:',
        missingFields.join(', '),
      );
      return false;
    }

    if (!hasLetters(username)) {
      Alert.alert(
        'Username Invalid',
        'Username must contain at least one letter!',
      );
      setLoading(false);
      return false;
    }

    if (password !== confirmPass) {
      Alert.alert('Error', 'Passwords do not match');
      setLoading(false);
      return false;
    }

    if (password.length < 5) {
      Alert.alert('Sorry!', 'Your password is too short. Try Another!');
      setLoading(false);
      return false;
    }

    if (email !== '') {
      const emailIsValid = await verifyEmail(email);
      if (!emailIsValid) {
        Alert.alert('Sorry!', 'That is not a valid email');
        setLoading(false);
        return false;
      }
    }

    try {
      let res = await fetch(`${API_URL}/api/user/validateUser`, {
        // Use backticks for template literals
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: username,
          password: password,
          email: email,
          phone: 'N/A',
          timezone: timezone ? timezone.value : 'America/Chicago',
          force_pass: forcePass,
        }),
      });

      if (!res.ok) {
        console.error('Network response was not ok', res.statusText); // Log error if response is not ok
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      res = await res.json();

      // @ts-ignore
      if (res.message) {
        // @ts-ignore
        if (res.message.includes('required')) {
          // @ts-ignore
          if (res.message.includes('username')) {
            setMissingUser(true);
          }
          // @ts-ignore
          if (res.message.includes('password')) {
            setMissingPassword(true);
          }
          // @ts-ignore
          if (res.message.includes('email')) {
            setMissingEmail(true);
          }
          // @ts-ignore
          if (res.message.includes('phone number')) {
            setMissingPhone(true);
          }
        }
        // @ts-ignore
        return res.message === 'User Cleared.';
      }
    } catch (error) {
      Alert.alert('User Error', 'There is already an account with that email.');
      setLoading(false);
    }

    Alert.alert('User Error', 'Please input all valid data');
    setLoading(false);
    return false;
  };

  const svgToBlob = async (svgString: string | Blob) => {
    try {
      // @ts-ignore
      const blob = new Blob([svgString], {type: 'image/svg+xml'});
      return blob;
    } catch (error) {
      console.error('Error converting svg to Blob:', error);
      throw error;
    }
  };

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      return fcmToken;
    } else {
      console.log('Failed to get FCM token');
    }
  };

  const accountCreation = async () => {
    let token = await getFcmToken();

    if (password !== confirmPass) {
      Alert.alert('Error', 'Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 5) {
      //@ts-ignore
      Alert.alert('Passwords do not match');
      setLoading(false);
      return;
    }

    if (timezone === null) {
      //@ts-ignore
      Alert.alert('Timezone must be filled');
      setLoading(false);
      return;
    }

    if (username.length > 50) {
      Alert.alert('Username must be less than 50 characters.');
      return;
    }

    // More validations...

    let params = {
      user_name: username,
      password: password,
      email: email,
      phone: 'N/A',
      status: 'basic',
      pfp_path: '',
      badges: [],
      tier: '1',
      coffee: '0',
      rank: '0',
      bio: '',
      first_name: firstName,
      last_name: lastName,
      external_auth: '',
      start_user_info: {
        usage: 'I want to learn how to code by doing really cool projects.',
        proficiency: 'Beginner',
        tags: 'python,javascript,golang,web development,game development,machine learning,artificial intelligence',
        preferred_language: 'Python, Javascript, Golang, Typescript',
      },
      timezone: timezone ? timezone.value : 'America/Chicago',
      avatar_settings: {
        topType: Attributes.topType,
        accessoriesType: Attributes.accessoriesType,
        hairColor: Attributes.hairColor,
        facialHairType: Attributes.facialHairType,
        clotheType: Attributes.clotheType,
        clotheColor: Attributes.clotheColor,
        eyeType: Attributes.eyeType,
        eyebrowType: Attributes.eyebrowType,
        mouthType: Attributes.mouthType,
        avatarStyle: Attributes.avatarStyle,
        skinColor: Attributes.skinColor,
      },
      force_pass: forcePass,
      fcm_token: token,
    };

    try {
      const svgBlob = await svgToBlob(testProfilePic);
      await fetchWithUpload(
        `${API_URL}/api/user/createNewUser`,
        svgBlob,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
          credentials: 'include',
        },
        (res: any) => {
          if (res.message !== 'User Created.') {
            Alert.alert('Something went wrong...', res.message);
          }

          if (res === undefined) {
            Alert.alert('Network Error', 'Unable to connect to the server.');
          }

          if (res.message === 'User Created.') {
            createLogin();

            // @ts-ignore
            navigation.navigate('JourneyMain');

            setLoading(false);
          }
        },
      );
    } catch (error) {
      Alert.alert('Network Error', 'Unable to connect to the server.');
      setLoading(false);
    }
  };

  const debouncedAccountCreation = debounce(accountCreation, 3000);

  const renderExternal = () => {
    return (
      <View style={styles.content}>
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Create Encryption Password</Text>
            <HapticTouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.navigate('Intro')}>
              <Text style={styles.closeIcon}>✕</Text>
            </HapticTouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888888"
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              cursorColor={theme.colors.primary}
              right={
                <TextInput.Icon
                  icon={showPass ? 'eye-off' : 'eye'}
                  onPress={() => setShowPass(!showPass)}
                  color="white"
                  style={{paddingTop: 8}}
                />
              }
            />
          </View>
          <HapticAwesomeButton
            width={width * 0.9}
            height={50}
            backgroundColor={theme.colors.primary}
            backgroundDarker={theme.colors.primaryVariant}
            textColor={theme.colors.onPrimary}
            borderRadius={12}
            textFontFamily={theme.fonts.medium.fontFamily}
            style={styles.createButton}
            onPress={() => {
              externalLogin === 'Google' ? googleCreate() : githubCreate();
            }}
            disabled={loading}>
            <Text style={styles.createButtonText}>
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </Text>
          </HapticAwesomeButton>
          <Text style={styles.termsText}>
            We use this additoinal password to encrypt your data so that only
            you can unlock your data.
          </Text>
        </View>

        <View>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}>
              Login
            </Text>
          </Text>
          <Text style={styles.termsText}>
            By signing up to Gigo, you agree to our Terms and Privacy Policy.
          </Text>
        </View>
      </View>
    );
  };

  const renderLabel = (label: string) => (
    <Text style={styles.inputLabel}>{label}</Text>
  );

  const renderCreateAccount = () => {
    return (
      <View style={styles.content}>
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <HapticTouchableOpacity
              style={styles.closeButton}
              // @ts-ignore
              onPress={() => navigation.navigate('Intro')}>
              <Text style={styles.closeIcon}>✕</Text>
            </HapticTouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#888888"
              value={username}
              onChangeText={setUsername}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              cursorColor={theme.colors.primary}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888888"
              value={email}
              onChangeText={setEmail}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              cursorColor={theme.colors.primary}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888888"
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              cursorColor={theme.colors.primary}
              right={
                <TextInput.Icon
                  icon={showPass ? 'eye-off' : 'eye'}
                  onPress={() => setShowPass(!showPass)}
                  color="white"
                  style={{paddingTop: 8}}
                />
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#888888"
              secureTextEntry={!showPass}
              value={confirmPass}
              onChangeText={setConfirmPass}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              cursorColor={theme.colors.primary}
            />
          </View>
          <HapticAwesomeButton
            width={width * 0.9}
            height={50}
            backgroundColor={theme.colors.primary}
            // @ts-ignore
            backgroundDarker={theme.colors.primaryVariant}
            textColor={theme.colors.onPrimary}
            borderRadius={12}
            // @ts-ignore
            textFontFamily={theme.fonts.medium.fontFamily}
            style={styles.createButton}
            onPress={validateUser}
            disabled={loading}>
            <Text style={styles.createButtonText}>
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </Text>
          </HapticAwesomeButton>
        </View>

        <View>
          <View style={styles.socialLoginContainer}>
            <Text style={styles.socialLoginTitle}>Or Register With:</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={googleSignUp}>
                <Image source={googleLogo} style={{width: 40, height: 40}} />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <LoginGithub
                clientId="Ov23liWncdWCkys9HUil"
                redirectUri={'gigoapp://callback'}
                onSuccess={onSuccessGithubCreate}
                onFailure={onFailureGithub}
                containerHeight={windowHeight * 1.8}
                containerWidth={windowWidth}
                buttonStyle={styles.socialButton}>
                <SvgXml xml={githubLogo} width={40} height={40} />
                <Text style={styles.socialButtonText}>Github</Text>
              </LoginGithub>
            </View>
          </View>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}>
              Login
            </Text>
          </Text>
          <Text style={styles.termsText}>
            By signing up to Gigo, you agree to our Terms and Privacy Policy.
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        {external || true ? renderExternal() : renderCreateAccount()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateNewAccount;
