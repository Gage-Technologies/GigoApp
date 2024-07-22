/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, useTheme, Menu} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CppLogo from '../img/Cpp_Logo.svg';
import GoLogo from '../img/Go-Logo-Blue.svg';
import CSharpLogo from '../img/Logo_C_sharp.svg';
import JavaScriptLogo from '../img/logo-javascript.svg';
import RustLogo from '../img/logo-rust.svg';
import PythonLogo from '../img/python-logo.svg';
import {useSelector} from 'react-redux';
import {selectRemainingHearts} from '../reducers/hearts';
import HeartTracker from './HeartTracker';

// define the available programming languages with their icons
const programmingLanguages = [
  {name: 'JavaScript', icon: JavaScriptLogo},
  {name: 'Python', icon: PythonLogo},
  {name: 'Go', icon: GoLogo},
  {name: 'Rust', icon: RustLogo},
  {name: 'C++', icon: CppLogo},
  {name: 'C#', icon: CSharpLogo},
];

// define a custom fire orange color
const FIRE_ORANGE = '#FF6B35';

const TopBar = () => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    programmingLanguages[0],
  );
  const userHearts = useSelector(selectRemainingHearts);
  const userStreak = 7; // hardcoded value for development
  const userMembershipLevel = 'Basic'; // hardcoded value for development

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

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
            {renderLogo(selectedLanguage.icon)}
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
              setSelectedLanguage(lang);
              closeMenu();
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

      <View
        style={[
          styles.membershipContainer,
          {backgroundColor: theme.colors.primary + '20'},
        ]}>
        <Icon name="crown" size={20} color={theme.colors.primary} />
        <Text style={[styles.membershipText, {color: theme.colors.primary}]}>
          Pro Level: {userMembershipLevel}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.streakContainer}>
          <Icon name="fire" size={24} color={FIRE_ORANGE} />
          <Text style={[styles.statsText, {color: theme.colors.onSurface}]}>
            {userStreak}
          </Text>
        </View>
        <HeartTracker />
      </View>
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