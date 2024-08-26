import React, {useEffect, useState} from 'react';
import {TextInput, Button} from 'react-native-paper';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
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

  // useEffect(() => {
  //   const updateDimensions = () => {
  //     setWindowHeight(Dimensions.get('window').height);
  //     setWindowWidth(Dimensions.get('window').width);
  //   };
  //
  //   const handleOpenURL = (event: { url: string }) => {
  //     console.log('Received deep link:', event.url);
  //     // Handle the deep link logic here
  //   };
  //
  //   // Set up the deep link listener
  //   const linkingSubscription = Linking.addEventListener('url', handleOpenURL);
  //
  //   // Handle the case when the app is opened from a deep link
  //   Linking.getInitialURL().then((url) => {
  //     if (url) {
  //       handleOpenURL({ url });
  //     }
  //   });
  //
  //   // Set up the dimensions listener
  //   const dimensionsSubscription = Dimensions.addEventListener('change', updateDimensions);
  //
  //   // Cleanup function to remove event listeners
  //   return () => {
  //     linkingSubscription.remove(); // Properly remove the deep link listener
  //     dimensionsSubscription.remove(); // Properly remove the dimensions listener
  //   };
  // }, []);

  const styles = StyleSheet.create({
    keyboardContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    box: {
      backgroundColor: '#1c3f30',
      borderRadius: 10,
      width: width, // 99% of screen width
      height: 460, // 70% of screen height
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: -16,
      padding: 20,
    },
    openingBox: {
      backgroundColor: '#1c3f30',
      borderRadius: 20,
      width: width, // 90% of screen width
      height: height * 0.26, // 25% of screen height
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      position: 'absolute',
      bottom: 100,
    },
    creationBox: {
      backgroundColor: '#1c3f30',
      borderRadius: 10,
      width: width, // 90% of screen width
      height: height * 0.7, // 25% of screen height
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 100,
    },
    header: {
      fontSize: 24,
      marginBottom: 20,
      color: 'white',
      alignSelf: 'center',
    },
    input: {
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
      justifyContent: 'space-evenly',
      width: screenWidth * 0.8,
    },
    button: {
      padding: 10,
      alignItems: 'center', // Center content horizontally
      justifyContent: 'center', // Center content vertically
      marginVertical: 5, // Provides vertical spacing between buttons
      borderRadius: 25, // Rounded edges
      backgroundColor: '#4b9288', // Unique background color
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
      marginTop: 10,
      width: '70%',
    },
    buttonExtraCreation: {
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
      padding: 10,
      borderRadius: 5,
      justifyContent: 'center',
      minHeight: 35,
      width: '50%',
      marginTop: 10,
    },
    externalButtonText: {
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
    // button: {
    //   borderRadius: 25, // Rounded edges
    //   backgroundColor: '#4b9288', // Unique background color
    // },
    buttonContent: {
      height: 50, // Optional: Adjust height
    },
    gorillaLogo: {
      width: 100,
      height: 100,
    },
    goBackContainer: {
      flexDirection: 'row', // Align items in a row
      alignItems: 'center', // Center items vertically
      justifyContent: 'flex-start', // Align items to the start (left) of the container
      padding: 10, // Add some padding for touch area
      backgroundColor: 'transparent', // Make the background transparent
      width: '100%',
    },
    icon: {
      marginRight: 5, // Add some space between the icon and the text
    },
    goBack: {
      color: 'white', // Set text color to white
      fontSize: 16, // Adjust font size as needed
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
    // setLoading(true);
    // console.log("here 3")
  };

  const testProfilePic = `<svg width="264px" height="280px" viewBox="0 0 264 280" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="width: 150px; height: 150px; position: relative; top: 35px;"><desc>Created with getavataaars.com</desc><defs><circle id="react-path-1" cx="120" cy="120" r="120"></circle><path d="M12,160 C12,226.27417 65.72583,280 132,280 C198.27417,280 252,226.27417 252,160 L264,160 L264,-1.42108547e-14 L-3.19744231e-14,-1.42108547e-14 L-3.19744231e-14,160 L12,160 Z" id="react-path-2"></path><path d="M124,144.610951 L124,163 L128,163 L128,163 C167.764502,163 200,195.235498 200,235 L200,244 L0,244 L0,235 C-4.86974701e-15,195.235498 32.235498,163 72,163 L72,163 L76,163 L76,144.610951 C58.7626345,136.422372 46.3722246,119.687011 44.3051388,99.8812385 C38.4803105,99.0577866 34,94.0521096 34,88 L34,74 C34,68.0540074 38.3245733,63.1180731 44,62.1659169 L44,56 L44,56 C44,25.072054 69.072054,5.68137151e-15 100,0 L100,0 L100,0 C130.927946,-5.68137151e-15 156,25.072054 156,56 L156,62.1659169 C161.675427,63.1180731 166,68.0540074 166,74 L166,88 C166,94.0521096 161.51969,99.0577866 155.694861,99.8812385 C153.627775,119.687011 141.237365,136.422372 124,144.610951 Z" id="react-path-3"></path></defs><g id="Avataaar" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-825.000000, -1100.000000)" id="Avataaar/Circle"><g transform="translate(825.000000, 1100.000000)">
    <g id="Mask"></g>
    <g id="Avataaar" stroke-width="1" fill-rule="evenodd" mask="url(#react-mask-5)">
    <g id="Body" transform="translate(32.000000, 36.000000)">
    <mask id="react-mask-6" fill="white">
    <use xlink:href="#react-path-3"></use>
    </mask>
    <use fill="#D0C6AC" xlink:href="#react-path-3"></use>
    <g id="Skin/👶🏽-03-Brown" mask="url(#react-mask-6)" fill="#D08B5B">
    <g transform="translate(0.000000, 0.000000)" id="Color">
        <rect x="0" y="0" width="264" height="280"></rect>
    </g>
    </g>
        <path d="M156,79 L156,102 C156,132.927946 130.927946,158 100,158 C69.072054,158 44,132.927946 44,102 L44,79 L44,94 C44,124.927946 69.072054,150 100,150 C130.927946,150 156,124.927946 156,94 L156,79 Z" id="Neck-Shadow" fill-opacity="0.100000001" fill="#000000" mask="url(#react-mask-6)">
        </path></g><g id="Clothing/Graphic-Shirt" transform="translate(0.000000, 170.000000)"><defs>
        <path d="M165.624032,29.2681342 C202.760022,32.1373245 232,63.1798426 232,101.051724 L232,110 L32,110 L32,101.051724 C32,62.8348009 61.7752018,31.5722494 99.3929298,29.1967444 C99.1342224,30.2735458 99,31.3767131 99,32.5 C99,44.3741221 113.998461,54 132.5,54 C151.001539,54 166,44.3741221 166,32.5 C166,31.4015235 165.871641,30.3222877 165.624025,29.2681336 Z" id="react-path-17"></path></defs><mask id="react-mask-18" fill="white"><use xlink:href="#react-path-17"></use></mask><use id="Clothes" fill="#E6E6E6" fill-rule="evenodd" xlink:href="#react-path-17"></use><g id="Color/Palette/Gray-01" mask="url(#react-mask-18)" fill-rule="evenodd" fill="#E6E6E6"><rect id="🖍Color" x="0" y="0" width="264" height="110"></rect></g><g id="Clothing/Graphic/Skull" mask="url(#react-mask-18)" fill-rule="evenodd" fill="#FFFFFF"><g transform="translate(77.000000, 58.000000)" id="Fill-49"><path d="M65.2820354,19.9288113 C64.9841617,22.7059411 59.588846,24.2025715 57.6102394,22.3766824 C56.6984983,21.5350479 56.6825881,19.8029182 56.4815012,18.6751632 C56.1014249,16.5420247 55.8256486,14.4172496 55.7306295,12.2519776 C55.6727342,10.9274596 55.3253621,9.86749314 56.7745135,9.67029008 C57.65797,9.55055964 58.5675014,10.137767 59.2896464,10.6026028 C61.736719,12.1758255 65.6201265,16.7414286 65.2820354,19.9288113 M52.8813831,14.0756657 C53.1659984,16.901216 54.2014853,21.8145656 51.9457767,24.1810024 C49.9296045,26.2960933 45.7863308,24.19905 45.1631825,21.7084809 C44.3897714,18.6188195 47.4383369,14.9274245 49.307782,12.8387447 C49.881874,12.1969544 51.151594,10.4256483 52.1442119,11.018578 C52.526056,11.2461539 52.8367463,13.6301981 52.8813831,14.0756657 M54.3212536,25.1062722 C54.9678252,23.5832306 61.2342228,28.1246236 58.2744891,30.2850536 C57.7918806,30.6376421 54.1148633,31.7513112 53.4099544,31.2274906 C51.9250051,30.1235056 53.8408548,26.2630794 54.3212536,25.1062722 M73.3250687,17.5267194 C72.8817937,2.05112066 53.065234,-2.31331777 42.4756895,6.50447654 C38.426551,9.87585667 36.113389,14.0039155 36.0073212,19.2826191 C35.9171635,23.7544627 36.6256081,27.9718792 40.0409914,31.0465744 C41.5219631,32.379896 42.5004386,33.1955596 43.2862243,35.0170469 C44.1095756,36.9234899 44.4852324,39.3524331 46.0280771,40.8495037 C46.8788292,41.6752915 48.1176128,42.3417322 49.2940816,41.8091079 C51.455655,40.8301355 50.7644465,37.8320326 51.4194152,36.1606486 C53.4559171,41.1294616 58.6302582,42.7141291 59.5694002,36.4097935 C60.6000257,38.2286397 63.2945899,40.610483 65.268335,38.6195243 C66.0806376,37.8003393 66.2030575,36.4705391 66.3409457,35.3929652 C66.5857855,33.4807998 66.1601884,32.7294032 67.6955199,31.4180909 C71.7349355,27.9683578 73.4691441,22.7464381 73.3250687,17.5267194"></path></g></g></g><g id="Face" transform="translate(76.000000, 82.000000)" fill="#000000"><g id="Mouth/Sad" transform="translate(2.000000, 52.000000)" fill-opacity="0.699999988" fill="#000000"><path d="M40.0582943,16.6539438 C40.7076459,23.6831146 46.7016363,28.3768187 54,28.3768187 C61.3416045,28.3768187 67.3633339,23.627332 67.9526838,16.5287605 C67.9840218,16.1513016 67.0772329,15.8529531 66.6289111,16.077395 C61.0902255,18.8502083 56.8805885,20.2366149 54,20.2366149 C51.1558456,20.2366149 47.0072148,18.8804569 41.5541074,16.168141 C41.0473376,15.9160792 40.0197139,16.2363147 40.0582943,16.6539438 Z" id="Mouth" transform="translate(54.005357, 22.188409) scale(1, -1) translate(-54.005357, -22.188409) "></path></g><g id="Nose/Default" transform="translate(28.000000, 40.000000)" fill-opacity="0.16"><path d="M16,8 C16,12.418278 21.372583,16 28,16 L28,16 C34.627417,16 40,12.418278 40,8" id="Nose"></path></g><g id="Eyes/Hearts-😍" transform="translate(0.000000, 8.000000)" fill-opacity="0.8" fill-rule="nonzero" fill="#FF5353">
        <path d="M35.9583333,10 C33.4074091,10 30.8837273,11.9797894 29.5,13.8206358 C28.1106364,11.9797894 25.5925909,10 23.0416667,10 C17.5523182,10 14,13.3341032 14,17.6412715 C14,23.3708668 18.4118636,26.771228 23.0416667,30.376724 C24.695,31.6133636 27.8223436,34.7777086 28.2083333,35.470905 C28.5943231,36.1641015 30.3143077,36.1885229 30.7916667,35.470905 C31.2690257,34.7532872 34.3021818,31.6133636 35.9583333,30.376724 C40.5853182,26.771228 45,23.3708668 45,17.6412715 C45,13.3341032 41.4476818,10 35.9583333,10 Z" id="Heart"></path><path d="M88.9583333,10 C86.4074091,10 83.8837273,11.9797894 82.5,13.8206358 C81.1106364,11.9797894 78.5925909,10 76.0416667,10 C70.5523182,10 67,13.3341032 67,17.6412715 C67,23.3708668 71.4118636,26.771228 76.0416667,30.376724 C77.695,31.6133636 80.8223436,34.7777086 81.2083333,35.470905 C81.5943231,36.1641015 83.3143077,36.1885229 83.7916667,35.470905 C84.2690257,34.7532872 87.3021818,31.6133636 88.9583333,30.376724 C93.5853182,26.771228 98,23.3708668 98,17.6412715 C98,13.3341032 94.4476818,10 88.9583333,10 Z" id="Heart"></path></g><g id="Eyebrow/Natural/Unibrow-Natural" fill-opacity="0.599999964"><path d="M57.000525,12 C56.999825,11.9961 56.999825,11.9961 57.000525,12 M59.4596631,14.892451 C61.3120123,16.058698 64.1131185,16.7894891 65.7030886,17.0505179 C71.9486685,18.0766191 78.0153663,15.945512 84.1715051,15.0153209 C89.636055,14.1895424 95.8563653,13.4967455 100.86041,16.507708 C100.987756,16.584232 101.997542,17.2147893 102.524546,17.7511372 C102.91024,18.1443003 103.563259,18.0619945 103.822605,17.5722412 C105.241692,14.8939029 97.7243204,8.76008291 96.2812935,8.14993193 C89.7471082,5.39200867 81.0899445,8.32440654 74.4284137,9.38927986 C70.6888462,9.98718701 66.9279989,10.3803501 63.2409655,11.2908151 C61.9188284,11.6171635 60.6278928,12.2066818 59.3382119,12.3724317 C59.1848981,12.1429782 58.9889964,12 58.7633758,12 C57.5922879,12 55.8451696,15.4574504 58.0750241,15.6547468 C58.7728345,15.7164887 59.215997,15.3816732 59.4596631,14.892451 Z" id="Kahlo" transform="translate(80.500000, 12.500000) rotate(-2.000000) translate(-80.500000, -12.500000) "></path><path d="M54.999475,12 C55.000175,11.9961 55.000175,11.9961 54.999475,12 M15.7187065,8.14993193 C22.2528918,5.39200867 30.9100555,8.32440654 37.5715863,9.38927986 C41.3111538,9.98718701 45.0720011,10.3803501 48.7590345,11.2908151 C50.2416282,11.6567696 51.6849876,12.3536477 53.1313394,12.4128263 C53.8325707,12.4413952 54.2674737,13.2763566 53.8149484,13.8242681 C52.3320222,15.6179895 48.3271239,16.7172136 46.2969114,17.0505179 C40.0513315,18.0766191 33.9846337,15.945512 27.8284949,15.0153209 C22.363945,14.1895424 16.1436347,13.4967455 11.1395899,16.507708 C11.0122444,16.584232 10.0024581,17.2147893 9.47545402,17.7511372 C9.0897602,18.1443003 8.43674067,18.0619945 8.17739482,17.5722412 C6.75830756,14.8939029 14.2756796,8.76008291 15.7187065,8.14993193 Z M54.9339874,11 C56.1050753,11 57.8521936,15.4015737 55.6223391,15.6527457 C53.3924847,15.9039176 53.7628995,11 54.9339874,11 Z" id="Frida" transform="translate(32.348682, 12.500000) rotate(2.000000) translate(-32.348682, -12.500000) "></path></g></g><g id="Top" stroke-width="1" fill-rule="evenodd"><defs><rect id="react-path-22" x="0" y="0" width="264" height="280"></rect><path d="M1,64 C1.34685629,65.488448 2.67275588,65.2226722 3,64 C2.53726005,62.445722 6.29594493,35.2480719 16,28 C19.618222,25.4833872 39.0082164,23.2319099 58.3126144,23.245568 C77.4086061,23.2590787 96.4208396,25.5105561 100,28 C109.704055,35.2480719 113.46274,62.445722 113,64 C113.327244,65.2226722 114.653144,65.488448 115,64 C115.719178,53.7019177 115,0.274362825 58,1 C1,1.72563718 0.280821545,53.7019177 1,64 Z" id="react-path-23"></path><filter x="-0.8%" y="-2.0%" width="101.5%" height="108.0%" filterUnits="objectBoundingBox" id="react-filter-19"><feOffset dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.16 0" type="matrix" in="shadowOffsetOuter1" result="shadowMatrixOuter1"></feColorMatrix><feMerge><feMergeNode in="shadowMatrixOuter1"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs><mask id="react-mask-20" fill="white"><use xlink:href="#react-path-22"></use></mask><g id="Mask"></g><g id="Top/Short-Hair/The-Caesar" mask="url(#react-mask-20)"><g transform="translate(-1.000000, 0.000000)"><g id="Facial-Hair/Beard-Light" transform="translate(49.000000, 72.000000)"><defs><path d="M101.428403,98.1685688 C98.9148372,100.462621 96.23722,101.494309 92.8529444,100.772863 C92.2705777,100.648833 89.8963391,96.2345713 83.9998344,96.2345713 C78.1033297,96.2345713 75.7294253,100.648833 75.1467245,100.772863 C71.7624488,101.494309 69.0848316,100.462621 66.5712661,98.1685688 C61.8461772,93.855604 57.9166219,87.9081858 60.2778299,81.4191814 C61.5083844,78.0369425 63.5097479,74.3237342 67.1506257,73.2459109 C71.0384163,72.0955419 76.4968931,73.2439051 80.4147542,72.4582708 C81.6840664,72.2035248 83.0706538,71.7508657 83.9998344,71 C84.929015,71.7508657 86.3159365,72.2035248 87.5845805,72.4582708 C91.5027758,73.2439051 96.9612525,72.0955419 100.849043,73.2459109 C104.489921,74.3237342 106.491284,78.0369425 107.722173,81.4191814 C110.083381,87.9081858 106.153826,93.855604 101.428403,98.1685688 M140.081033,26 C136.670693,34.4002532 137.987774,44.8580348 137.356666,53.6758724 C136.844038,60.8431942 135.33712,71.5857526 128.972858,76.214531 C125.718361,78.5816138 119.79436,82.5598986 115.54187,81.4501943 C112.614539,80.6863848 112.302182,72.290096 108.455284,69.1469801 C104.09172,65.5823153 98.6429854,64.0160432 93.1491481,64.2578722 C90.7785381,64.3622683 85.9841367,64.3374908 83.9999331,66.1604584 C82.0157295,64.3374908 77.2216647,64.3622683 74.8510547,64.2578722 C69.3568808,64.0160432 63.9081467,65.5823153 59.5445817,69.1469801 C55.6976839,72.290096 55.3856641,80.6863848 52.4583326,81.4501943 C48.2058427,82.5598986 42.2818421,78.5816138 39.0270077,76.214531 C32.6624096,71.5857526 31.1561652,60.8431942 30.642864,53.6758724 C30.0120926,44.8580348 31.3291729,34.4002532 27.9188335,26 C26.2597768,26 27.3540339,42.1288693 27.3540339,42.1288693 L27.3540339,62.4851205 C27.3856735,77.7732046 36.935095,100.655445 58.1080116,109.393004 C63.2861266,111.52982 75.0153111,115 83.9999331,115 C92.9845551,115 104.71374,111.860188 109.891855,109.723371 C131.064771,100.985813 140.614193,77.7732046 140.646169,62.4851205 L140.646169,42.1288693 C140.646169,42.1288693 141.740089,26 140.081033,26" id="react-path-25"></path></defs><mask id="react-mask-24" fill="white"><use xlink:href="#react-path-25"></use></mask><use id="Lite-Beard" fill="#331B0C" fill-rule="evenodd" xlink:href="#react-path-25"></use><g id="Color/Hair/Brown" mask="url(#react-mask-24)" fill="#4A312C"><g transform="translate(-32.000000, 0.000000)" id="Color"><rect x="0" y="0" width="264" height="244"></rect></g></g></g><g id="Hair" stroke-width="1" fill-rule="evenodd" transform="translate(75.000000, 34.000000)"><mask id="react-mask-21" fill="white"><use xlink:href="#react-path-23"></use></mask><use id="Caesar" fill="#28354B" xlink:href="#react-path-23"></use><g id="Skin/👶🏽-03-Brown" mask="url(#react-mask-21)" fill="#4A312C"><g transform="translate(0.000000, 0.000000) " id="Color"><rect x="0" y="0" width="264" height="280"></rect></g></g></g><g id="Top/_Resources/Wayfarers" fill="none" transform="translate(62.000000, 85.000000)" stroke-width="1"><defs><filter x="-0.8%" y="-2.4%" width="101.6%" height="109.8%" filterUnits="objectBoundingBox" id="react-filter-28"><feOffset dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.2 0" type="matrix" in="shadowOffsetOuter1" result="shadowMatrixOuter1"></feColorMatrix><feMerge><feMergeNode in="shadowMatrixOuter1"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="react-linear-gradient-29"><stop stop-color="#FFFFFF" stop-opacity="0.5" offset="0%"></stop><stop stop-color="#000000" stop-opacity="0.5" offset="70.5058195%"></stop></linearGradient><path d="M44.9178864,17.5714286 C44.9178864,27.2737857 36.66775,35.1428571 22.9204545,35.1428571 L20.1704091,35.1428571 C6.42311364,35.1428571 0.923022727,27.2708571 0.923022727,17.5714286 L0.923022727,17.5714286 C0.923022727,7.86614286 2.20715909,0 21.4545455,0 L24.3863636,0 C43.63375,0 44.9178864,7.86614286 44.9178864,17.5714286 L44.9178864,17.5714286 Z" id="react-path-26"></path><path d="M106.486068,17.5714286 C106.486068,27.2737857 98.2388636,35.1428571 84.4886364,35.1428571 L81.7385909,35.1428571 C67.9912955,35.1428571 62.4912045,27.2708571 62.4912045,17.5714286 L62.4912045,17.5714286 C62.4912045,7.86614286 63.7753409,0 83.0227273,0 L85.9545455,0 C105.199,0 106.486068,7.86614286 106.486068,17.5714286 L106.486068,17.5714286 Z" id="react-path-27"></path></defs><g id="Wayfarers" filter="url(#react-filter-28)" transform="translate(7.000000, 7.000000)"><g id="Shades" transform="translate(10.795455, 2.928571)" fill-rule="nonzero"><g id="Shade"><use fill-opacity="0.700000048" fill="#000000" fill-rule="evenodd" xlink:href="#react-path-26"></use><use fill="url(#react-linear-gradient-29)" fill-rule="evenodd" xlink:href="#react-path-26" style="mix-blend-mode: screen;"></use></g><g id="Shade"><use fill-opacity="0.700000048" fill="#000000" fill-rule="evenodd" xlink:href="#react-path-27"></use><use fill="url(#react-linear-gradient-29)" fill-rule="evenodd" xlink:href="#react-path-27" style="mix-blend-mode: screen;"></use></g></g><path d="M33.7159091,41 L30.9658636,41 C17.0778409,41 8.78665909,33.3359286 8.78665909,20.5 C8.78665909,10.127 10.5985227,0 32.25,0 L35.1818182,0 C56.8332955,0 58.6451591,10.127 58.6451591,20.5 C58.6451591,32.5686429 48.3955227,41 33.7159091,41 Z M32.25,5.85421429 C14.6502955,5.85421429 14.6502955,12.3175714 14.6502955,20.5 C14.6502955,27.1800714 17.4795,35.1428571 30.9658636,35.1428571 L33.7159091,35.1428571 C44.9418409,35.1428571 52.7815227,29.1217143 52.7815227,20.5 C52.7815227,12.3175714 52.7815227,5.85421429 35.1818182,5.85421429 L32.25,5.85421429 Z" id="Left" fill="#252C2F" fill-rule="nonzero"></path><path d="M95.2840909,41 L92.5340455,41 C78.6460227,41 70.3548409,33.3359286 70.3548409,20.5 C70.3548409,10.127 72.1667045,0 93.8181818,0 L96.75,0 C118.401477,0 120.213341,10.127 120.213341,20.5 C120.213341,32.5686429 109.963705,41 95.2840909,41 Z M93.8181818,5.85421429 C76.2184773,5.85421429 76.2184773,12.3175714 76.2184773,20.5 C76.2184773,27.1800714 79.0506136,35.1428571 92.5340455,35.1428571 L95.2840909,35.1428571 C106.510023,35.1428571 114.349705,29.1217143 114.349705,20.5 C114.349705,12.3175714 114.349705,5.85421429 96.75,5.85421429 L93.8181818,5.85421429 Z" id="Right" fill="#252C2F" fill-rule="nonzero"></path><path d="M2.93181818,5.85714286 C3.61786364,5.17185714 11.1233182,0 32.25,0 C49.9640455,0 53.7138409,1.88014286 59.3898409,4.72085714 L59.8053162,4.93054903 C60.1999353,5.07314243 62.2179351,5.77419634 64.5784525,5.85128811 C66.7290156,5.75689949 68.5684809,5.16080623 69.1059926,4.96981137 C75.5844654,1.74762081 81.9260118,0 96.75,0 C117.876682,0 125.382136,5.17185714 126.068182,5.85714286 C127.689477,5.85714286 129,7.16621429 129,8.78571429 L129,11.7142857 C129,13.3337857 127.689477,14.6428571 126.068182,14.6428571 C126.068182,14.6428571 120.204545,14.6428571 120.204545,17.5714286 C120.204545,20.5 117.272727,13.3337857 117.272727,11.7142857 L117.272727,8.8618831 C113.697201,7.46243482 107.296654,5.85714286 96.75,5.85714286 C84.9995538,5.85714286 79.1475515,6.98813142 74.1276604,9.10414393 L74.1837955,9.24257143 L71.6878772,10.2500422 L74.1813177,11.2582547 L71.981173,16.6874536 L69.263564,15.5885995 C69.0208516,15.4904597 68.4971539,15.3141463 67.770994,15.1309826 C65.7466083,14.6203594 63.6653786,14.4649153 61.8248214,14.8513001 C61.1495627,14.993056 60.5230576,15.2057795 59.9480988,15.4931011 L57.3260941,16.8033836 L54.7026238,11.5651815 L57.3246285,10.2548989 L57.3310023,10.251716 L54.8191364,9.23671429 L54.8992448,9.03890561 C50.5700368,6.97578666 46.5781927,5.85714286 32.25,5.85714286 C21.7038986,5.85714286 15.3034993,7.46145875 11.7272727,8.86093383 L11.7272727,11.7142857 C11.7272727,13.3337857 8.79545455,20.5 8.79545455,17.5714286 C8.79545455,14.6428571 2.93181818,14.6428571 2.93181818,14.6428571 C1.31345455,14.6428571 0,13.3337857 0,11.7142857 L0,8.78571429 C0,7.16621429 1.31345455,5.85714286 2.93181818,5.85714286 Z" id="Stuff" fill="#252C2F" fill-rule="nonzero"></path>
    </g></g></g></g></g></g></g></g></g></svg>`;

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

      setLoading(false);
    } else {
      if (AsyncStorage.getItem('alive') === null) {
        //@ts-ignore
        swal('Sorry, we failed to log you in, please try again on login page');
      }
      setLoading(false);
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
              } else {
                Alert.alert(
                  'Login Failed',
                  'Sorry, we failed to log you in. Please try again on the login page.',
                );
              }
            } catch (error) {
              //@ts-ignore
              Alert.alert(
                'Login Error',
                'An error occurred during the authorization process.',
              );
            }
          }
        },
      );
    } catch (error) {
      Alert.alert(
        'Login Error',
        'An error occurred during the GitHub user creation process.',
      );
    } finally {
      setLoading(false);
    }
  };

  // const githubCreate = async () => {
  //   // //this is for github and cannot be finished until app is semi launched
  //   // if (!ghConfirm) {
  //   //   Alert.alert('Error', 'BAD');
  //   //   setLoading(false);
  //   //   return;
  //   // }
  //
  //   setLoading(true);
  //
  //   let token = await getFcmToken();
  //   console.log("token is: ", token)
  //
  //   const svgString = profilePic;
  //
  //   console.log("here i am")
  //   try {
  //     //@ts-ignore
  //     const svgBlob = await svgToBlob(svgString);
  //
  //     let params = {
  //       external_auth: externalToken,
  //       password: password,
  //       start_user_info: {
  //         usage: 'I want to learn how to code by doing really cool projects.',
  //         proficiency: 'Beginner',
  //         tags: 'python,javascript,golang,web development,game development,machine learning,artificial intelligence',
  //         preferred_language: 'Python, Javascript, Golang, Typescript',
  //       },
  //       timezone: timezone ? timezone.value : 'America/Chicago',
  //       avatar_settings: {
  //         topType: Attributes.topType,
  //         accessoriesType: Attributes.accessoriesType,
  //         hairColor: Attributes.hairColor,
  //         facialHairType: Attributes.facialHairType,
  //         clotheType: Attributes.clotheType,
  //         clotheColor: Attributes.clotheColor,
  //         eyeType: Attributes.eyeType,
  //         eyebrowType: Attributes.eyebrowType,
  //         mouthType: Attributes.mouthType,
  //         avatarStyle: Attributes.avatarStyle,
  //         skinColor: Attributes.skinColor,
  //       },
  //       fcm_token: token,
  //     };
  //     let create = await fetchWithUpload(
  //       `${API_URL}/api/user/createNewGithubUser`,
  //       svgBlob,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(params),
  //         credentials: 'include',
  //       },
  //       (res: any) => {
  //         console.log("res is: ", res)
  //         if (res.message !== 'Github User Added.') {
  //           Alert.alert('Something went wrong here...', res.message);
  //         }
  //
  //         if (res === undefined) {
  //           Alert.alert('Network Error', 'Unable to connect to the server.');
  //         }
  //
  //         if (res.message === 'Github User Added.') {
  //           authorizeGithub(password).then(auth => {
  //             console.log("auth is: ", auth)
  //             // @ts-ignore
  //             if (auth.user !== undefined) {
  //               let authState = Object.assign({}, initialAuthStateUpdate);
  //               authState.authenticated = true;
  //               // @ts-ignore
  //               authState.expiration = auth.exp;
  //               // @ts-ignore
  //               authState.id = auth.user;
  //               // @ts-ignore
  //               authState.role = auth.user_status;
  //               // @ts-ignore
  //               authState.email = auth.email;
  //               // @ts-ignore
  //               authState.phone = auth.phone;
  //               // @ts-ignore
  //               authState.userName = auth.user_name;
  //               // @ts-ignore
  //               authState.thumbnail = auth.thumbnail;
  //               //@ts-ignore
  //               authState.exclusiveContent = auth.exclusive_account;
  //               //@ts-ignore
  //               authState.exclusiveAgreement = auth.exclusive_agreement;
  //               dispatch(updateAuthState(authState));
  //
  //               // this makes sure the dispatch occurs
  //               sleep(1000).then(() => {
  //                 navigation.navigate(
  //                   //@ts-ignore
  //                   'JourneyMain',
  //                 );
  //               });
  //             } else {
  //               Alert.alert(
  //                 'Sorry, we failed to log you in, please try again on login page.',
  //               );
  //             }
  //           });
  //         }
  //       },
  //     );
  //     Alert.alert('Login Error', 'An error occurred during the login process.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onFailureGithub = () => {
    Alert.alert('Login Failed', 'GitHub login failed. Please try again.');
  };

  //     const googleSignUp = async () => {
  //         console.log("hello in signup")
  //     }

  const googleSignUp = async () => {
    setLoading(true);
    try {
      //             await GoogleSignin.configure({
      //                       androidClientId: GOOGLE_ANDROID_CLIENT_ID,
      //                       webClientId: GOOGLE_WEB_CLIENT_ID,
      //             });
      //             const {idToken} = await GoogleSignin.signIn();
      //             console.log("id token: ", idToken)
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.idToken;

      onSuccessGoogle(idToken);
    } catch (error) {
      Alert.alert('Sign-Up Error', 'Failed to authenticate with Google.');
      console.error(error);
    } finally {
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
              } else {
                Alert.alert(
                  'Sorry, we failed to log you in, please try again on login page.',
                );
              }
            });
          }
        },
      );
    } catch (error) {
      Alert.alert('Error', 'Network request failed');
    } finally {
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
      console.log('error: ', error); // Log the error
      Alert.alert('Network Error', 'Unable to connect to the server.', [
        {text: 'OK', style: 'cancel'},
      ]);
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
        setLoading(false);
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
      Alert.alert('Network Error', 'Unable to connect to the server.');
    }

    setLoading(false);
    return false;
  };
  //todo add later
  //     let {name} = useParams();

  // const handleCreateAccount = async () => {
  //   const isValid = await validateUser();
  //   if (isValid) {
  //     // Implement account creation logic
  //     console.log('Account creation initiated');
  //   }
  // };

  //     const fileToBlob = async (uri) => {
  //         try {
  //             console.log("1: ", uri);
  //
  //             let path = uri;
  //             if (uri.startsWith('file://')){
  //                 path = uri.replace('file://', '')
  //             }
  //
  //             // Read the file as base64
  //             const response = await RNFetchBlob.fs.readFile(path, 'base64');
  //             console.log("2");
  //
  //             // Convert base64 string to byte array
  //             const byteCharacters = atob(response);
  //             const byteNumbers = new Array(byteCharacters.length);
  //             for (let i = 0; i < byteCharacters.length; i++) {
  //                 byteNumbers[i] = byteCharacters.charCodeAt(i);
  //             }
  //             const byteArray = new Uint8Array(byteNumbers);
  //
  //             // Create Blob from byte array
  //             const blob = new Blob([byteArray], { type: 'application/octet-stream' });
  //             console.log("3");
  //
  //             return blob;
  //         } catch (error) {
  //             console.error('Error converting file to Blob:', error);
  //             throw error;
  //         }
  //     };

  const svgToBlob = async (svgString: string | Blob) => {
    try {
      //             const byteCharacters = atob(svgString);
      //             const byteNumbers = new Array(byteCharacters.length);
      //             for (let i = 0; i < byteCharacters.length; i++){
      //                 byteNumbers[i] = byteCharacters.charCodeAt(i)
      //             }
      //             const byteArray = new Uint8Array(byteNumbers);
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
      // Alert.alert('FCM Token', fcmToken); // Display the token for testing purposes
      // Save the token to your backend if needed
      return fcmToken;
    } else {
      console.log('Failed to get FCM token');
    }
  };

  const accountCreation = async () => {
    setLoading(true);
    let token = await getFcmToken();

    // const svgString = profilePic;

    //         const formData = new FormData();
    //         formData.append('image', {
    //             uri: profilePic,
    //             type: 'image/jpeg', // or the appropriate type based on your image
    //             name: 'image.jpg', // or the name of your image file
    //         });
    //         formData.append('avatar', {
    //             uri: svgUri, // You need to generate this URI from your SVG component
    //             type: 'image/svg+xml',
    //             name: 'avatar.svg'
    //         });
    //

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
            //                         payload = {
            //                             host: window.location.host,
            //                             event: WebTrackingEvent.Signup,
            //                             timespent: 0,
            //                             path: location.pathname,
            //                             latitude: null,
            //                             longitude: null,
            //                             metadata: {
            //                                 mobile: isMobile,
            //                                 width: window.innerWidth,
            //                                 height: window.innerHeight,
            //                                 user_agent: navigator.userAgent,
            //                                 referrer: document.referrer,
            //                             },
            //                         }
            //                         trackEvent(payload);
            createLogin();

            // @ts-ignore
            navigation.navigate('JourneyMain');
          }
        },
      );
    } catch (error) {
      Alert.alert('Network Error', 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const debouncedAccountCreation = debounce(accountCreation, 3000);

  const renderExternal = () => {
    return step === 0 ? (
      <View style={styles.box}>
        <Text style={styles.header}>Create a Password</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor:
                password.length > 5 && password !== '' ? 'green' : 'red',
            },
          ]}
          placeholder="Password"
          secureTextEntry={!showPass}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor={'white'}
          mode={'flat'}
          underlineColor="transparent"
          theme={{
            colors: {
              primary: 'transparent', // Outline color when focused
            },
          }}
        />
        <TextInput
          style={[
            styles.input,
            {
              borderColor:
                password === confirmPass && password !== '' ? 'green' : 'red',
            },
          ]}
          placeholder="Confirm Password"
          secureTextEntry={!showPass}
          value={confirmPass}
          onChangeText={setConfirmPass}
          onSubmitEditing={() => {
            externalLogin === 'Google' ? googleCreate() : githubCreate();
          }}
          placeholderTextColor={'white'}
          mode={'flat'}
          underlineColor="transparent"
          theme={{
            colors: {
              primary: 'transparent', // Outline color when focused
            },
          }}
        />
        <Text style={{color: 'white'}}>
          We use this password to encrypt sensitive information.
        </Text>
        <Button
          onPress={() => {
            externalLogin === 'Google' ? googleCreate() : githubCreate();
          }}
          //@ts-ignore
          title="Create Account"
          disabled={loading}
          style={styles.buttonExtra}>
          <Text style={styles.buttonText}>Create Account</Text>
        </Button>
        <Text style={styles.signInWith}>Already linked your account?</Text>
        <Button
          onPress={() => {
            // @ts-ignore
            navigation.navigate('Login');
          }}
          //@ts-ignore
          title="Sign In"
          color="blue"
          style={{marginBottom: 20, marginTop: -10}}>
          <Text style={{color: '#4b9288'}}>Sign In</Text>
        </Button>
      </View>
    ) : (
      <View style={styles.box}>{/* Render questions or other content */}</View>
    );
  };

  let renderCreateForm = () => {
    // @ts-ignore
    // @ts-ignore
    return creationStep === 0 ? (
      <View style={styles.openingBox}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text
            style={{
              color: 'white',
              fontSize: 26,
              fontWeight: 'bold',
              marginBottom: 10,
            }}>
            Learn To Code For Free
          </Text>
          <Text style={{color: 'white', fontSize: 20}}>
            With Thousands of Lessons
          </Text>
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <Button
              mode="contained"
              contentStyle={styles.buttonContent}
              style={styles.button}
              onPress={() => setCreationStep(1)}>
              Let's Get Started
            </Button>
          </View>
        </ScrollView>
      </View>
    ) : (
      <View style={styles.creationBox}>
        <TouchableOpacity
          onPress={() => setCreationStep(0)}
          style={styles.goBackContainer}>
          <Icon name="arrow-left" size={20} color="white" style={styles.icon} />
          <Text style={styles.goBack}>Go Back</Text>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>Create Account</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor={'white'}
            mode={'flat'}
            underlineColor="transparent"
            theme={{
              colors: {
                primary: 'transparent', // Outline color when focused
              },
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={'white'}
            mode={'flat'}
            underlineColor="transparent"
            theme={{
              colors: {
                primary: 'transparent', // Outline color when focused
              },
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor={'white'}
            underlineColor="transparent"
            mode={'flat'}
            theme={{
              colors: {
                primary: 'transparent', // Outline color when focused
              },
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={true}
            value={confirmPass}
            onChangeText={setConfirmPass}
            placeholderTextColor={'white'}
            underlineColor="transparent"
            mode={'flat'}
            theme={{
              colors: {
                primary: 'transparent', // Outline color when focused
              },
            }}
          />
          <TouchableOpacity
            onPress={async () => {
              let ok = await validateUser();
              if (ok) {
                console.log('content');
                debouncedAccountCreation();
              }
            }}
            style={styles.buttonExtraCreation}
            activeOpacity={0.7}
            disabled={
              missingEmail ||
              missingPassword ||
              missingConfirm ||
              invalidUsername ||
              username === '' ||
              email === '' ||
              password === '' ||
              confirmPass === '' ||
              password !== confirmPass
            }>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
          <View style={styles.socialLogin}>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.signInWith}>Or Register With:</Text>
              <View style={styles.loginContainer}>
                <TouchableOpacity onPress={() => googleSignUp()}>
                  <View style={styles.innerContainer}>
                    <Image style={styles.logo} source={googleLogo} />
                  </View>
                </TouchableOpacity>
                <CreateGithub
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
                  containerHeight={windowHeight} // Pass the height
                  containerWidth={windowWidth} // Pass the width
                  onSuccess={onSuccessGithubCreate}
                  onFailure={onFailureGithub}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <SvgXml
                      xml={githubLogo}
                      width={imageWidth}
                      height={imageWidth}
                    />
                  </View>
                </CreateGithub>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Text style={{color: 'white', fontSize: 16, lineHeight: 18}}>
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() =>
                //@ts-ignore
                navigation.navigate('Login')
              }>
              <Text
                style={{
                  color: '#a4c598',
                  fontSize: 16,
                  marginLeft: 10,
                  lineHeight: 18,
                }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView // Wrap your content with KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardContainer}>
      <Image source={require('../img/monkeyJungle.png')} />
      {!external ? renderCreateForm() : renderExternal()}
    </KeyboardAvoidingView>
  );
};

export default CreateNewAccount;
