/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
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
  const [visible, setVisible] = useState(false);
  const {selectedLanguage, setSelectedLanguage} = useLanguage();
  const userMembershipLevel = 'Basic'; // hardcoded value for development
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [proPopupVisible, setProPopupVisible] = useState(false); // State for ProPopup visibility
  const [membershipString, setMembershipString] = React.useState('');
  const [membership, setMembership] = React.useState(0);
  const dispatch = useDispatch();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const openProPopup = () => setProPopupVisible(true); // Open ProPopup
  const closeProPopup = async () => {
    // Close the ProPopup immediately
    setProPopupVisible(false);

    // Set a timeout to delay the API call and membership update by 45 seconds
    setTimeout(async () => {
      try {
        let followResponse = await fetch(
          `${Config.API_URL}/api/user/subscriptionApp`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          },
        );

        if (!followResponse.ok) {
          console.log('follow response is: ', followResponse.ok);
          throw new Error('Network response was not ok');
        }

        const res = await followResponse.json();

        let authState = Object.assign({}, initialAuthStateUpdate);
        // @ts-ignore
        authState.role = res.current_subscription;
        console.log('res auth role here after 45 seconds: ', res.current_subscription);

        // Dispatch the updated membership status to the store
        dispatch(updateAuthState(authState));
        console.log('res is: ', res);

        if (res.current_subscription === 0) {
          setMembershipString('Free');
        } else if (res.current_subscription === 1) {
          setMembershipString('Basic');
        } else if (res.current_subscription === 2) {
          setMembershipString('Advanced');
        } else if (res.current_subscription === 3) {
          setMembershipString('Max');
        } else {
          setMembershipString('Free');
        }

        setMembership(res.current_subscription);
      } catch (error) {
        console.log('error getting user membership level after delay:', error);
      }
    }, 10000); // Delay of 45000 milliseconds (45 seconds)
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

  const authState = useSelector(selectAuthState);

  const getProStatus = async () => {
    console.log('in get pro status');
    try {
      let followResponse = await fetch(
        `${Config.API_URL}/api/user/subscriptionApp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        },
      );

      if (!followResponse.ok) {
        console.log('follow response is: ', followResponse.ok);
        throw new Error('Network response was not ok');
      }

      console.log('authstate role: ', authState.role);

      const res = await followResponse.json();
      console.log('res is: ', res);

      if (authState.role === 0) {
        setMembershipString('Free');
      } else if (authState.role === 1) {
        setMembershipString('Basic');
      } else if (authState.role === 2) {
        setMembershipString('Advanced');
      } else if (authState.role === 3) {
        setMembershipString('Max');
      } else {
        setMembershipString('Free');
      }

      setMembership(authState.role);
    } catch (error) {
      console.log('error getting user membership level: ', error);
    }
  };

  useEffect(() => {
    console.log('in effect');
    getProStatus();
    getStreakData();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const renderLogo = (Icon: React.ComponentType<any>) => (
    <Icon width={24} height={24} style={styles.logo} />
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.primary + '80',
          borderBottomWidth: 2,
        },
      ]}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        contentStyle={{backgroundColor: theme.colors.surface}}
        anchor={
          <TouchableOpacity style={styles.languageSelector} onPress={openMenu}>
            {renderLogo(
              programmingLanguages.find(lang => lang.name === selectedLanguage)
                ?.icon,
            )}
            <Icon
              name="chevron-down"
              size={24}
              color={theme.colors.onSurface}
            />
          </TouchableOpacity>
        }
        style={{marginTop: 40}} // Adjust this value as needed
      >
        {programmingLanguages.map(lang => (
          <Menu.Item
            key={lang.name}
            onPress={() => {
              setSelectedLanguage(lang.name);
              closeMenu();
              console.log('Setting new language:', lang.name);
            }}
            title={
              <View style={styles.menuItemContent}>
                {renderLogo(lang.icon)}
                <Text
                  style={[
                    styles.menuItemText,
                    {color: theme.colors.onSurface},
                  ]}>
                  {lang.name}
                </Text>
              </View>
            }
          />
        ))}
      </Menu>

      <TouchableOpacity
        style={[
          styles.membershipContainer,
          {backgroundColor: theme.colors.primary + '20'},
        ]}
        onPress={openProPopup}>
        <Icon name="crown" size={20} color={theme.colors.primary} />
        <Text style={[styles.membershipText, {color: theme.colors.primary}]}>
          Pro Level: {membershipString}
        </Text>
      </TouchableOpacity>

      <View style={styles.statsContainer}>
        {streakData && (
          <View style={styles.streakContainer}>
            <Icon name="fire" size={24} color={FIRE_ORANGE} />
            <Text style={[styles.statsText, {color: theme.colors.onSurface}]}>
              {streakData.current_streak}
            </Text>
          </View>
        )}
        <HeartTracker />
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    elevation: 4,
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
    fontSize: 16,
    marginLeft: 8,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  membershipText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});

export default TopBar;
