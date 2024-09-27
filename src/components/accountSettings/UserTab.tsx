import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import HapticTouchableOpacity from '../Buttons/HapticTouchableOpacity';
import {Dialog, Portal, Button} from 'react-native-paper';

interface UserTabProps {
  username: string;
  email: string;
  phone: string;
  edit: boolean;
  setEdit: (edit: boolean) => void;
  newUsername: string;
  setNewUsername: (username: string) => void;
  newEmail: string;
  setNewEmail: (email: string) => void;
  newPhone: string;
  setNewPhone: (phone: string) => void;
  oldPassword: string;
  setOldPassword: (password: string) => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  deleteAccount: boolean;
  setDeleteAccount: (deleteAccount: boolean) => void;
  confirmDeletionContent: string;
  setConfirmDeletionContent: (content: string) => void;
  editUser: () => void;
  deleteUserAccount: () => void;
}

const UserTab: React.FC<UserTabProps> = ({
  username,
  email,
  phone,
  edit,
  setEdit,
  newUsername,
  setNewUsername,
  newEmail,
  setNewEmail,
  newPhone,
  setNewPhone,
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  deleteAccount,
  setDeleteAccount,
  confirmDeletionContent,
  setConfirmDeletionContent,
  editUser,
  deleteUserAccount,
}) => {
  return (
    <View style={styles.centeredView}>
      <View style={styles.contentWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          value={newUsername}
          editable={edit}
          onChangeText={setNewUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={newEmail}
          editable={edit}
          onChangeText={setNewEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#888"
          value={newPhone}
          editable={edit}
          onChangeText={setNewPhone}
        />
        {edit && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Old Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <View style={styles.buttonRow}>
              <HapticTouchableOpacity
                onPress={() => setEdit(false)}
                style={styles.cancelEditUser}>
                <Text style={styles.buttonText}>Cancel</Text>
              </HapticTouchableOpacity>
              <HapticTouchableOpacity
                onPress={editUser}
                style={styles.submitEditUser}>
                <Text style={styles.buttonText}>Submit</Text>
              </HapticTouchableOpacity>
            </View>
          </>
        )}
        {!edit && (
          <HapticTouchableOpacity
            onPress={() => setEdit(true)}
            style={styles.actionButton}>
            <Text style={styles.buttonText}>Edit User Details</Text>
          </HapticTouchableOpacity>
        )}
      </View>
      <View style={styles.deleteAccountContainer}>
        <HapticTouchableOpacity
          onPress={() => setDeleteAccount(true)}
          style={[styles.actionButton, styles.deleteUserButton]}>
          <Text style={styles.buttonText}>Delete Account</Text>
        </HapticTouchableOpacity>
      </View>
      <Portal>
        <Dialog
          visible={deleteAccount}
          onDismiss={() => setDeleteAccount(false)}
          style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>
            Delete Account
          </Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Are you sure you want to delete your account?
            </Text>
            <Text style={styles.dialogText}>
              Account deletion is permanent and cannot be undone. If you
              delete your account, you will lose all of your work.
            </Text>
            <TextInput
              style={styles.inputDelete}
              placeholder="Type Confirm"
              placeholderTextColor="#888"
              value={confirmDeletionContent}
              onChangeText={setConfirmDeletionContent}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteAccount(false)} color="#29C18C">
              Cancel
            </Button>
            <Button
              onPress={deleteUserAccount}
              disabled={confirmDeletionContent.toLowerCase() !== 'confirm'}
              color="red">
              Confirm
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'space-between', // change to space-between
    alignItems: 'center',
    paddingBottom: 20, // add padding at the bottom
  },
  contentWrapper: {
    paddingTop: 50,
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: Dimensions.get('window').width - 50,
    height: 50,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'gray',
  },
  inputDelete: {
    width: Dimensions.get('window').width - 100,
    height: 50,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'gray',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width - 50, // match input field width
    marginBottom: 20, // add some bottom margin
  },
  cancelEditUser: {
    borderColor: '#2f6d58',
    borderRadius: 5,
    borderWidth: 1,
    width: '48%', // slightly less than half to account for space between
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  submitEditUser: {
    borderColor: '#2f6d58',
    borderRadius: 5,
    borderWidth: 1,
    width: '48%', // slightly less than half to account for space between
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  actionButton: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#27ab7c',
    width: Dimensions.get('window').width - 50, // set consistent width
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  deleteAccountContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 80,
  },
  deleteUserButton: {
    borderColor: 'red',
  },
  buttonText: {
    color: 'white',
  },
  dialog: {
    backgroundColor: '#1c1c1a',
  },
  dialogTitle: {
    color: 'white',
  },
  dialogText: {
    color: 'white',
    marginBottom: 10,
  },
});

export default UserTab;
