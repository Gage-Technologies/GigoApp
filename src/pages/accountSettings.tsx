import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Alert, BackHandler} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Config from 'react-native-config';

import {initialAuthStateUpdate, initialState, selectAuthState, updateAuthState} from '../reducers/auth';
import SettingsMenu from '../components/accountSettings/SettingsMenu';
import UserTab from '../components/accountSettings/UserTab';
import WorkspaceTab from '../components/accountSettings/WorkspaceTab';
import MembershipTab from '../components/accountSettings/MembershipTab';
import ReportIssueTab from '../components/accountSettings/ReportIssueTab';

const AccountSettings = () => {
  const navigation = useNavigation();
  const authStateSetup = useSelector(selectAuthState);
  const dispatch = useDispatch();

  const username = authStateSetup.userName;
  const email = authStateSetup.email;
  const phone = authStateSetup.phone;

  const [selectedTab, setSelectedTab] = useState('Main');
  const [edit, setEdit] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [confirmDeletionContent, setConfirmDeletionContent] = useState('');
  const [workspaceRunStart, setWorkspaceRunStart] = useState(false);
  const [workspaceLogging, setWorkspaceLogging] = useState(false);
  const [workspaceSilent, setWorkspaceSilent] = useState(false);
  const [workspaceUpdateInterval, setWorkspaceUpdateInterval] = useState('');
  const [workspaceCommitMessage, setWorkspaceCommitMessage] = useState('');
  const [workspaceLocale, setWorkspaceLocale] = useState('');
  const [workspaceTimeZone, setWorkspaceTimeZone] = useState('');
  const [holidayPref, setHolidayPref] = useState(false);
  const [membership, setMembership] = useState(0);
  const [membershipString, setMembershipString] = useState('');
  const [membershipCost, setMembershipCost] = useState('');
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [issueText, setIssueText] = useState('');

  const API_URL = Config.API_URL;

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (selectedTab !== 'Main') {
          setSelectedTab('Main');
          return true;
        }
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [selectedTab]),
  );

  const editWorkspace = async () => {
    console.log('in edit workspace');

    if (workspaceCommitMessage === '') {
      Alert.alert('Please enter a commit message.');
      return;
    }

    const updateInterval = parseInt(workspaceUpdateInterval, 10);

    if (isNaN(updateInterval)) {
      Alert.alert('Invalid Input', 'Update interval must be a valid number.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/user/updateWorkspace`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspace_settings: {
            auto_git: {
              runOnStart: workspaceRunStart,
              updateInterval: updateInterval,
              logging: workspaceLogging,
              silent: workspaceSilent,
              commitMessage: workspaceCommitMessage,
              locale: workspaceLocale,
              timeZone: workspaceTimeZone,
            },
          },
        }),
      });

      const res = await response.json();
      console.log('workspace response: ', res);

      if ('message' in res) {
        const message = res.message;
        if (message === 'workspace settings edited successfully') {
          Alert.alert(
            'Success',
            'Your workspace settings were edited successfully.',
          );
        } else {
          Alert.alert(
            'Server Error',
            'An error occurred editing your workspace settings.',
          );
        }
      } else {
        Alert.alert(
          'Server Error',
          'An error occurred editing your workspace settings.',
        );
      }
    } catch (error) {
      Alert.alert(
        'Network Error',
        'An error occurred editing your workspace settings. Please try again later.',
      );
    }
  };

  useEffect(() => {
    const loadSessionData = async () => {
      try {
        const storedValue = await AsyncStorage.getItem('accountsPage');
        if (storedValue !== null && storedValue === 'membership') {
          setSelectedTab('Membership');
        }
        await AsyncStorage.removeItem('accountsPage');
      } catch (error) {
        console.error('Error reading session data', error);
      }

      await apiLoad();
      checkUserHoliday();
    };

    loadSessionData();
  }, []);

  const apiLoad = async () => {
    try {
      // const subscriptionResponse = await fetch(
      //   `${API_URL}/api/user/subscriptionApp`,
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({}),
      //   },
      // );

      // if (!subscriptionResponse.ok) {
      //   throw new Error(
      //     `Subscription response failed: ${
      //       subscriptionResponse.status
      //     } - ${subscriptionResponse.json()}`,
      //   );
      // }

      // const res = await subscriptionResponse.json();

      // setMembership(res.current_subscription);
      // setMembershipString(
      //   res.current_subscription === 0
      //     ? 'Free'
      //     : res.current_subscription === 1
      //     ? 'Basic'
      //     : res.current_subscription === 2
      //     ? 'Advanced'
      //     : res.current_subscription === 3
      //     ? 'Max'
      //     : 'Free',
      // );
      // setMembershipCost(
      //   res.current_subscription === 1
      //     ? '3.00'
      //     : res.current_subscription === 2
      //     ? '8.00'
      //     : res.current_subscription === 3
      //     ? '15.00'
      //     : '0.00',
      // );

      const nameResponse = await fetch(`${API_URL}/api/user/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!nameResponse.ok) {
        throw new Error(
          `User retrieval failed: ${
            nameResponse.status
          } - ${nameResponse.json()}`,
        );
      }

      const response = await nameResponse.json();

      if (response !== undefined && response.user !== undefined) {
        setNewUsername(response.user.user_name);
        setNewEmail(response.user.email);
        setNewPhone(response.user.phone);
        setWorkspaceRunStart(
          response.user.workspace_settings.auto_git.runOnStart,
        );
        setWorkspaceUpdateInterval(
          response.user.workspace_settings.auto_git.updateInterval.toString(),
        );
        setWorkspaceLogging(response.user.workspace_settings.auto_git.logging);
        setWorkspaceSilent(response.user.workspace_settings.auto_git.silent);
        setWorkspaceCommitMessage(
          response.user.workspace_settings.auto_git.commitMessage,
        );
        setWorkspaceLocale(response.user.workspace_settings.auto_git.locale);
        setWorkspaceTimeZone(
          response.user.workspace_settings.auto_git.timeZone,
        );
      }
    } catch (error) {
      console.error('Error in apiLoad:', error);
      Alert.alert('Error', 'Failed to load user data. Please try again.');
    }
  };

  const checkUserHoliday = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const res = await response.json();
      setHolidayPref(res.user.holiday_themes);
    } catch (error) {
      console.error('Error in checkUserHoliday:', error);
      Alert.alert(
        'Error',
        'There has been an issue loading holiday preferences. Please try again later.',
      );
    }
  };

  const editUser = async () => {
    if (newUsername.length > 50) {
      Alert.alert('Username must be less than 50 characters.');
      return;
    }

    if (newUsername !== username) {
      try {
        const response = await fetch(`${API_URL}/api/user/changeUsername`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({new_username: newUsername}),
        });

        const resUser = await response.json();

        if (resUser.message === 'Username updated successfully') {
          setEdit(false);
          let authStateUpdate = JSON.parse(
            JSON.stringify(initialAuthStateUpdate),
          );
          authStateUpdate.userName = newUsername;
          dispatch(updateAuthState(authStateUpdate));
          Alert.alert('Username updated successfully.');
        } else {
          Alert.alert(resUser.message);
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while updating the username.');
      }
    }

    if (newEmail !== email) {
      try {
        const response = await fetch(`${API_URL}/api/user/changeEmail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({new_email: newEmail}),
        });

        const resEmail = await response.json();

        if (resEmail.message === 'Email updated successfully') {
          setEdit(false);
          let authStateUpdate = JSON.parse(
            JSON.stringify(initialAuthStateUpdate),
          );
          authStateUpdate.email = newEmail;
          dispatch(updateAuthState(authStateUpdate));
          Alert.alert('Success', 'Email updated successfully.');
        } else if (resEmail.message === 'email is already in use') {
          Alert.alert(
            'Email in use',
            'It appears the email you provided is already in use.',
          );
        } else {
          Alert.alert('Error', resEmail.message);
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while updating the email.');
      }
    }

    if (newPhone !== phone) {
      try {
        const response = await fetch(`${API_URL}/api/user/changePhone`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({new_phone: newPhone}),
        });

        const resPhone = await response.json();

        if (resPhone.message === 'Phone number updated successfully') {
          setEdit(false);
          let authStateUpdate = JSON.parse(
            JSON.stringify(initialAuthStateUpdate),
          );
          authStateUpdate.phone = newPhone;
          dispatch(updateAuthState(authStateUpdate));
          Alert.alert('Phone number updated successfully.');
        } else {
          Alert.alert(resPhone.message);
        }
      } catch (error) {
        Alert.alert(
          'Error',
          'An error occurred while updating the phone number.',
        );
      }
    }

    if (newPassword !== '') {
      try {
        const response = await fetch(`${API_URL}/api/user/changePassword`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword,
          }),
        });

        const resPass = await response.json();

        if (resPass.message === 'Password updated successfully') {
          setEdit(false);
          Alert.alert('Password changed successfully.');
        } else {
          Alert.alert(resPass.message);
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while changing the password.');
      }
    }
  };

  const deleteUserAccount = async () => {
    clearReducers();

    try {
      const response = await fetch(`${API_URL}/api/user/deleteUserAccount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const res = await response.json();

      if (!res || !res.message) {
        const alive = await AsyncStorage.getItem('alive');
        if (!alive) {
          Alert.alert(
            'Server Error',
            "We are unable to connect with the GIGO servers at this time. We're sorry for the inconvenience!",
          );
        }
        return;
      }

      if (res.message !== 'Account has been deleted.') {
        const alive = await AsyncStorage.getItem('alive');
        if (!alive) {
          Alert.alert(
            'Server Error',
            res.message !== 'internal server error occurred'
              ? res.message
              : "An unexpected error has occurred. We're sorry, we'll get right on that!",
          );
        }
        return;
      }

      Alert.alert(
        'User has been deleted.',
        'You will be redirected to the login page in a few.',
      );
      clearReducers();
      navigation.navigate(
        //@ts-ignore
        'Login',
      ); // Use your appropriate navigation method to redirect

      await AsyncStorage.setItem('homeIndex', 'undefined');
    } catch (error) {
      Alert.alert(
        'Error',
        'An error occurred while deleting the user account.',
      );
    }
  };

  const handleSubmit = async () => {
    await editWorkspace();
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await clearReducers();
      await AsyncStorage.clear();
      await new Promise(resolve => setTimeout(resolve, 300));
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    } finally {
      setLogoutLoading(false);
    }
  };

  const clearReducers = () => {
    const authState = {...initialState};
    dispatch(updateAuthState(authState));
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'User':
        return (
          <UserTab
            username={authStateSetup.userName}
            email={authStateSetup.email}
            phone={authStateSetup.phone}
            edit={edit}
            setEdit={setEdit}
            newUsername={newUsername}
            setNewUsername={setNewUsername}
            newEmail={newEmail}
            setNewEmail={setNewEmail}
            newPhone={newPhone}
            setNewPhone={setNewPhone}
            oldPassword={oldPassword}
            setOldPassword={setOldPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            deleteAccount={deleteAccount}
            setDeleteAccount={setDeleteAccount}
            confirmDeletionContent={confirmDeletionContent}
            setConfirmDeletionContent={setConfirmDeletionContent}
            editUser={editUser}
            deleteUserAccount={deleteUserAccount}
          />
        );
      case 'WorkspaceSettings':
        return (
          <WorkspaceTab
            workspaceRunStart={workspaceRunStart}
            setWorkspaceRunStart={setWorkspaceRunStart}
            workspaceLogging={workspaceLogging}
            setWorkspaceLogging={setWorkspaceLogging}
            workspaceSilent={workspaceSilent}
            setWorkspaceSilent={setWorkspaceSilent}
            workspaceUpdateInterval={workspaceUpdateInterval}
            setWorkspaceUpdateInterval={setWorkspaceUpdateInterval}
            workspaceCommitMessage={workspaceCommitMessage}
            setWorkspaceCommitMessage={setWorkspaceCommitMessage}
            workspaceLocale={workspaceLocale}
            setWorkspaceLocale={setWorkspaceLocale}
            workspaceTimeZone={workspaceTimeZone}
            setWorkspaceTimeZone={setWorkspaceTimeZone}
            holidayPref={holidayPref}
            setHolidayPref={setHolidayPref}
            handleSubmit={handleSubmit}
          />
        );
      case 'Membership':
        return (
          <MembershipTab
            membership={membership}
            membershipString={membershipString}
            membershipCost={membershipCost}
          />
        );
      case 'ReportIssue':
        return (
          <ReportIssueTab
            issueText={issueText}
            setIssueText={setIssueText}
            setSelectedTab={setSelectedTab}
          />
        );
      default:
        return (
          <SettingsMenu
            setSelectedTab={setSelectedTab}
            handleLogout={handleLogout}
            logoutLoading={logoutLoading}
          />
        );
    }
  };

  return (
    <PaperProvider>
      <View style={styles.mainContainer}>{renderContent()}</View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#1c1c1a',
  },
});

export default AccountSettings;
