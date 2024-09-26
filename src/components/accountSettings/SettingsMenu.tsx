import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface SettingsMenuProps {
  setSelectedTab: (tab: string) => void;
  handleLogout: () => void;
  logoutLoading: boolean;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  setSelectedTab,
  handleLogout,
  logoutLoading,
}) => {
  return (
    <View style={styles.tabsContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account Settings</Text>
        <View style={styles.headerUnderline} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>General</Text>
      </View>

      <TouchableOpacity
        onPress={() => setSelectedTab('User')}
        style={styles.tabButton}>
        <View style={styles.buttonContent}>
          <View style={[styles.leftContent, {marginRight: 5}]}>
            <Icon name="user" size={16} color="white" />
            <Text style={styles.tabText}>User</Text>
          </View>
          <Icon name="chevron-right" size={16} color="white" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setSelectedTab('Membership')}
        style={styles.tabButton}>
        <View style={styles.buttonContent}>
          <View style={styles.leftContent}>
            <Icon name="users" size={16} color="white" />
            <Text style={styles.tabText}>Membership</Text>
          </View>
          <Icon name="chevron-right" size={16} color="white" />
        </View>
      </TouchableOpacity>

      <View style={styles.supportHeader}>
        <Text style={styles.supportHeaderText}>Support</Text>
      </View>

      <TouchableOpacity
        onPress={() => setSelectedTab('ReportIssue')}
        style={styles.tabButton}>
        <View style={styles.buttonContent}>
          <View style={styles.leftContent}>
            <Icon name="exclamation-circle" size={16} color="white" />
            <Text style={styles.tabText}>Report Issue</Text>
          </View>
          <Icon name="chevron-right" size={16} color="white" />
        </View>
      </TouchableOpacity>

      <View style={styles.logoutContainer}>
        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.logoutButton, logoutLoading && styles.disabledButton]}
          disabled={logoutLoading}>
          {logoutLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.logoutText}>Logout</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  headerUnderline: {
    width: 50,
    height: 3,
    backgroundColor: '#29C18C',
    borderRadius: 2,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#29C18C',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tabButton: {
    backgroundColor: '#323230',
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 15,
  },
  supportHeader: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
  },
  supportHeaderText: {
    color: 'white',
  },
  logoutContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 80,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '60%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ffb3b3',
    opacity: 0.7,
  },
  logoutText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SettingsMenu;
