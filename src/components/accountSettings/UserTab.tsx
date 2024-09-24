import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';

const UserTab = ({ username, email, phone, edit, setEdit, newUsername, setNewUsername, newEmail, setNewEmail, newPhone, setNewPhone, oldPassword, setOldPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword, deleteAccount, setDeleteAccount, confirmDeletionContent, setConfirmDeletionContent, editUser, deleteUserAccount }) => {
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
        {/* ... other input fields ... */}
        {edit && (
          <>
            {/* ... password input fields ... */}
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={() => setEdit(false)} style={styles.cancelEditUser}>
                <Text style={{color: 'white'}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={editUser} style={styles.submitEditUser}>
                <Text style={{color: 'white'}}>Submit</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {!edit && (
          <TouchableOpacity onPress={() => setEdit(true)} style={styles.editUserButton}>
            <Text style={{color: 'white'}}>Edit User Details</Text>
          </TouchableOpacity>
        )}
        <View style={{marginTop: 15}}>
          <TouchableOpacity onPress={() => setDeleteAccount(true)} style={styles.deleteUserButton}>
            <Text style={{color: 'white'}}>Delete Account</Text>
          </TouchableOpacity>
          <Portal>
            <Dialog visible={deleteAccount} onDismiss={() => setDeleteAccount(false)} style={{backgroundColor: '#1c1c1a'}}>
              {/* ... Dialog content ... */}
            </Dialog>
          </Portal>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... styles ...
});

export default UserTab;