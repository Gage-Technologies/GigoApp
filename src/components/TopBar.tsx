/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import HapticTouchableOpacity from './Buttons/HapticTouchableOpacity';
import {Text, useTheme, Menu} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CppLogo from '../img/Cpp_Logo.svg';
import GoLogo from '../img/Go-Logo-Blue.svg';
import CSharpLogo from '../img/Logo_C_sharp.svg';
import JavaScriptLogo from '../img/logo-javascript.svg';
import RustLogo from '../img/logo-rust.svg';
import PythonLogo from '../img/python-logo.svg';
import HeartTracker from './HeartTracker';
import Config from 'react-native-config';
import ProPopup from './ProPopup'; // Import the ProPopup component
import {useLanguage} from '../LanguageContext';
import AllLogo from '../img/yellow_laptop.svg';
import {useDispatch, useSelector} from 'react-redux';
import {
  initialAuthStateUpdate,
  selectAuthState,
  updateAuthState,
} from '../reducers/auth.ts'; // Import the new SVG
import { refreshToken } from '../utils/refreshToken.ts';
import { useNavigation } from "@react-navigation/native";

// define the available programming languages with their icons
const programmingLanguages = [
  {name: 'All', icon: AllLogo},
  {name: 'JavaScript', icon: JavaScriptLogo},
  {name: 'Python', icon: PythonLogo},
  {name: 'Go', icon: GoLogo},
  {name: 'Rust', icon: RustLogo},
  {name: 'C++', icon: CppLogo},
  {name: 'C#', icon: CSharpLogo},
];

interface StreakData {
  current_streak: number;
  // add other fields from the API response as needed
}

// define a custom fire orange color
const FIRE_ORANGE = '#FF6B35';

const TopBar = () => {
  const theme = useTheme();

  const authState = useSelector(selectAuthState);

  const [visible, setVisible] = useState(false);
  const {selectedLanguage, setSelectedLanguage} = useLanguage();
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [proPopupVisible, setProPopupVisible] = useState(false); // State for ProPopup visibility
  const [membershipString, setMembershipString] = React.useState(
    authState.role === 0
      ? 'Free'
      : authState.role === 1
      ? 'Basic'
      : authState.role === 2
      ? 'Advanced'
      : authState.role === 3
      ? 'Max'
      : 'Free',
  );
  const [membership, setMembership] = React.useState(authState.role);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const openProPopup = () => setProPopupVisible(true); // Open ProPopup
  const closeProPopup = async () => {
    // Close the ProPopup immediately
    setProPopupVisible(false);

    // Set a timeout to delay the API call and membership update by 45 seconds
    setTimeout(() => refreshToken(dispatch), 10000); // Delay of 45000 milliseconds (45 seconds)
  };

  const getStreakData = async () => {
    try {
      const response = await fetch(`${Config.API_URL}/api/user/streakPage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const res = await response.json();

      if (res && res.stats && res.stats.length > 0) {
        setStreakData(res.stats[0]);
      } else {
        console.error('Invalid response from streakPage');
      }
    } catch (error) {
      console.error('Error fetching streak data:', error);
    }
  };

  useEffect(() => {
    console.log('in effect');
    getStreakData();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const renderLogo = (Icon: React.ComponentType<any>) => (
    <Icon width={24} height={24} style={styles.logo} />
  );

  return (
    <View
      style={
        styles.container}>

      <View style={styles.centerSection}>
        <HapticTouchableOpacity
          style={
            styles.membershipContainer}
          onPress={openProPopup}>
          <Icon name="crown" size={20} color={theme.colors.onPrimary} />
          {membership !== 0 ? (
            <Text style={styles.membershipText}>
              Pro Level: {membershipString}
            </Text>
          ) : (
            <Text style={styles.membershipText}>
              Go Pro
            </Text>
          )}
        </HapticTouchableOpacity>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.statsContainer}>
          {streakData && (
            <HapticTouchableOpacity style={styles.streakContainer} onPress={() => navigation.navigate('Stats')}>
              <Icon name="fire" size={24} color={FIRE_ORANGE} />
              <Text style={[styles.statsText, {color: theme.colors.onSurface}]}>
                {streakData.current_streak}
              </Text>
            </HapticTouchableOpacity>
          )}
          {membership === 0 && <HeartTracker />}
        </View>
      </View>

      <ProPopup
        visible={proPopupVisible}
        onDismiss={closeProPopup}
        membershipLevel={membership}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: '#1C1C1E', // Dark neutral
    borderBottomWidth: 1,
    borderBottomColor: '#333333', // Subtle border for sleek look
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightSection: {
    flex: 0.5, // Take less space in the right section to allow centerSection to shift left
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginRight: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statsText: {
    fontSize: 18,
    marginLeft: 8,
    color: '#FFFFFF', // White text for dark background
    fontWeight: 'bold',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: 8,
    fontSize: 16,
  },
  membershipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#2C2C2E', // Slightly lighter dark gray
    borderWidth: 1,
    borderColor: '#444444', // Subtle border
  },
  membershipText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default TopBar;
