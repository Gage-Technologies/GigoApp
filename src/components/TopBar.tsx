import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, useTheme, Menu, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CppLogo from '../img/Cpp_Logo.svg';
import GoLogo from '../img/Go-Logo-Blue.svg';
import CSharpLogo from '../img/Logo_C_sharp.svg';
import JavaScriptLogo from '../img/logo-javascript.svg';
import RustLogo from '../img/logo-rust.svg';
import PythonLogo from '../img/python-logo.svg';

// define the available programming languages with their icons
const programmingLanguages = [
  {name: 'JavaScript', icon: JavaScriptLogo},
  {name: 'Python', icon: PythonLogo},
  {name: 'Go', icon: GoLogo},
  {name: 'Rust', icon: RustLogo},
  {name: 'C++', icon: CppLogo},
  {name: 'C#', icon: CSharpLogo},
];

const TopBar = () => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    programmingLanguages[0],
  );
  const userHearts = 5; // hardcoded value for development
  const userStreak = 7; // hardcoded value for development

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const renderLogo = (Icon: React.ComponentType<any>) => (
    <Icon width={24} height={24} style={styles.logo} />
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.surface}]}>
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

      <Button
        mode="contained"
        onPress={() => console.log('Get Pro pressed')}
        style={styles.getProButton}
        labelStyle={styles.getProButtonLabel}
        contentStyle={styles.getProButtonContent}>
        Get Pro
      </Button>

      <View style={styles.statsContainer}>
        <View style={styles.streakContainer}>
          <Icon name="fire" size={24} color={theme.colors.primary} />
          <Text style={[styles.statsText, {color: theme.colors.onSurface}]}>
            {userStreak}
          </Text>
        </View>
        <View style={styles.heartsContainer}>
          <Icon name="heart" size={24} color={theme.colors.error} />
          <Text style={[styles.statsText, {color: theme.colors.onSurface}]}>
            {userHearts}
          </Text>
        </View>
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
  getProButton: {
    marginHorizontal: 0,
    borderRadius: 4,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 20},
    shadowOpacity: 0.25,
    shadowRadius: 6.84,
  },
  getProButtonLabel: {
    fontSize: 14,
    marginVertical: 0,
    marginHorizontal: 6,
    fontWeight: 'bold',
  },
  getProButtonContent: {
    height: 36,
    paddingHorizontal: 12,
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
  heartsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
});

export default TopBar;
