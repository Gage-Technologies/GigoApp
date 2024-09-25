import React from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import {Button} from 'react-native-paper';

interface WorkspaceTabProps {
  workspaceRunStart: boolean;
  setWorkspaceRunStart: (value: boolean) => void;
  workspaceLogging: boolean;
  setWorkspaceLogging: (value: boolean) => void;
  workspaceSilent: boolean;
  setWorkspaceSilent: (value: boolean) => void;
  workspaceUpdateInterval: string;
  setWorkspaceUpdateInterval: (value: string) => void;
  workspaceCommitMessage: string;
  setWorkspaceCommitMessage: (value: string) => void;
  workspaceLocale: string;
  setWorkspaceLocale: (value: string) => void;
  workspaceTimeZone: string;
  setWorkspaceTimeZone: (value: string) => void;
  holidayPref: boolean;
  setHolidayPref: (value: boolean) => void;
  handleSubmit: () => void;
}

const WorkspaceTab: React.FC<WorkspaceTabProps> = ({
  workspaceRunStart,
  setWorkspaceRunStart,
  workspaceLogging,
  setWorkspaceLogging,
  workspaceSilent,
  setWorkspaceSilent,
  workspaceUpdateInterval,
  setWorkspaceUpdateInterval,
  workspaceCommitMessage,
  setWorkspaceCommitMessage,
  workspaceLocale,
  setWorkspaceLocale,
  workspaceTimeZone,
  setWorkspaceTimeZone,
  holidayPref,
  setHolidayPref,
  handleSubmit,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Auto Git Settings</Text>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Enable Auto Git</Text>
        <Switch
          value={workspaceRunStart}
          onValueChange={setWorkspaceRunStart}
        />
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Enable Logging</Text>
        <Switch
          value={workspaceLogging}
          onValueChange={setWorkspaceLogging}
          disabled={!workspaceRunStart}
        />
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Silent Mode</Text>
        <Switch
          value={workspaceSilent}
          onValueChange={setWorkspaceSilent}
          disabled={!workspaceRunStart}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Update Interval (seconds)"
        placeholderTextColor="#888"
        value={workspaceUpdateInterval}
        onChangeText={setWorkspaceUpdateInterval}
        editable={workspaceRunStart}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Commit Message"
        placeholderTextColor="#888"
        value={workspaceCommitMessage}
        onChangeText={setWorkspaceCommitMessage}
        editable={workspaceRunStart}
      />
      <TextInput
        style={styles.input}
        placeholder="Locale"
        placeholderTextColor="#888"
        value={workspaceLocale}
        onChangeText={setWorkspaceLocale}
        editable={workspaceRunStart}
      />
      <TextInput
        style={styles.input}
        placeholder="Time Zone"
        placeholderTextColor="#888"
        value={workspaceTimeZone}
        onChangeText={setWorkspaceTimeZone}
        editable={workspaceRunStart}
      />

      <View style={styles.settingRow}>
        <Text style={styles.label}>Enable Holiday Themes</Text>
        <Switch value={holidayPref} onValueChange={setHolidayPref} />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    color: 'white',
  },
  input: {
    width: Dimensions.get('window').width - 60,
    height: 50,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 15,
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'gray',
    alignSelf: 'center',
  },
  submitButton: {
    backgroundColor: '#27ab7c',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default WorkspaceTab;
