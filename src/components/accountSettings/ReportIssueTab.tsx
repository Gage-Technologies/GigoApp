import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import {Button} from 'react-native-paper';
import Config from 'react-native-config';

interface ReportIssueTabProps {
  issueText: string;
  setIssueText: (text: string) => void;
  setSelectedTab: (tab: string) => void;
}

const ReportIssueTab: React.FC<ReportIssueTabProps> = ({
  issueText,
  setIssueText,
  setSelectedTab,
}) => {
  // rename this function to reflect its new purpose
  const handleClearIssue = () => {
    setIssueText('');
  };

  const handleSubmitIssue = async () => {
    try {
      const response = await fetch(`${Config.API_URL}/api/reportIssue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({page: 'app:settings', issue: issueText}),
      });

      const submitResponse = await response.json();

      if (
        submitResponse.message !== undefined &&
        submitResponse.message === 'Thank you for your feedback!'
      ) {
        setIssueText('');
        Alert.alert('Thank you for your feedback!');
        setSelectedTab('Main');
      } else {
        Alert.alert('Something went wrong, please try again.');
      }
    } catch (error) {
      console.error('Error submitting issue:', error);
      Alert.alert('Error', 'Failed to submit the issue. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report Issue</Text>
      <TextInput
        style={styles.textInput}
        multiline={true}
        numberOfLines={10}
        placeholder="Describe your issue here..."
        placeholderTextColor="#888"
        value={issueText}
        onChangeText={setIssueText}
        textAlignVertical="top"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleClearIssue}
          style={[
            styles.button,
            styles.clearButton,
            // disable the button when there's no text
            issueText.trim().length === 0 && styles.disabledButton,
          ]}
          // disable the button when there's no text
          disabled={issueText.trim().length === 0}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmitIssue}
          style={[styles.button, styles.submitButton]}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  textInput: {
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
  },
  submitButton: {
    backgroundColor: '#29C18C',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
});

export default ReportIssueTab;
