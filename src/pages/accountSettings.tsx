import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Button, Switch, Alert, Linking } from 'react-native';
import { Dialog, Portal, Provider as PaperProvider } from 'react-native-paper';
import { TabView, SceneMap, TabBar, Card, CardContent } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { selectAuthState} from "../reducers/auth.ts"

const AccountSettings = () => {
    const theme = useTheme();
    const authStateSetup = useSelector((state: RootState) => selectAuthState(state));
    const username = authStateSetup.userName
    const email = authStateSetup.email
    const phone = authStateSetup.phone
    const API_URL = Config.API_URL
    const [edit, setEdit] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [deleteAccount, setDeleteAccount] = useState(false);
    const [confirmDeletionContent, setConfirmDeletionContent] = useState('');
    const [connectedAccountLoading, setConnectedAccountLoading] = useState(false);
    const [wsSettingsLoading, setWsSettingsLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [tab, setTab] = useState('user');
    const [proPopupOpen, setProPopupOpen] = useState(false);
    const [stripeAccount, setStripeAccount] = useState('');
    const [authState, setAuthState] = useState({ id: '', tier: '', backgroundName: '', backgroundColor: '', backgroundRenderInFront: '' });
    const [config, setConfig] = useState({ rootPath: '' });
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'user', title: 'User' },
        { key: 'workspace', title: 'Workspace Settings' },
        { key: 'membership', title: 'Membership' },
        { key: 'exclusiveContent', title: 'Exclusive Content Setup' },
    ]);
    const [workspaceRunStart, setWorkspaceRunStart] = React.useState(false);
    const [workspaceLogging, setWorkspaceLogging] = React.useState(false);
    const [workspaceSilent, setWorkspaceSilent] = React.useState(false);
    const [workspaceUpdateInterval, setWorkspaceUpdateInterval] = React.useState('');
    const [workspaceCommitMessage, setWorkspaceCommitMessage] = React.useState('');
    const [workspaceLocale, setWorkspaceLocale] = React.useState('');
    const [workspaceTimeZone, setWorkspaceTimeZone] = React.useState('');
    const [holidayPref, setHolidayPref] = React.useState(false);
    const [membershipDates, setMembershipDates] = React.useState({ start: null, last: null, upcoming: null })
    const [membership, setMembership] = React.useState(0)
    const [membershipType, setMembershipType] = React.useState("info")
    const [loading, setLoading] = React.useState(false)
    const [subscription, setSubscription] = React.useState<Subscription | null>(null)
    const [inTrial, setInTrial] = React.useState(false)
    const [hasPaymentInfo, setHasPaymentInfo] = React.useState(false)
    const [alreadyCancelled, setAlreadyCancelled] = React.useState(false)
    const [membershipCost, setMembershipCost] = React.useState("")
    const [hasSubscriptionId, setHasSubscriptionId] = React.useState(false)
    const [userInfo, setUserInfo] = React.useState(null)
    const [Attributes, setAttributes] = useState({
        topType: "NoHair",
        accessoriesType: "Blank",
        avatarRef: {},
        hairColor: "Auburn",
        facialHairType: "Blank",
        clotheType: "ShirtScoopNeck",
        clotheColor: "Heather",
        eyeType: "Close",
        eyebrowType: "RaisedExcitedNatural",
        mouthType: "Serious",
        avatarStyle: "",
        skinColor: "Light",
    });
    const [avatarRef, setAvatarRef] = React.useState({})


    const updateHoliday = async () => {
        let update = fetch(`${API_URL}/api/user/updateHolidayPreference`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
        if (!update.ok){
            console.log("response here is: ", update)
            throw new Error('Network response was not ok');
        }
        const res = await update.json();
        if (res === undefined || res["message"] === undefined || res["message"] !== "user holiday preference updated") {
            swal("We are unable to process your request at this time. Please try again later.")
        } else {
            setHolidayPref(!holidayPref)
        }
    };

    const editUser = async () => {
        if (newUsername.length > 50) {
            Alert.alert("Username must be less than 50 characters.");
            return;
        }

        if (newUsername !== username) {
            try {
                const response = await fetch(`${API_URL}/api/user/changeUsername`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ new_username: newUsername }),
                });
                console.log("response is: ", response)

                const resUser = await response.json();
                console.log("res user: ", resUser)

                if (resUser.message === "Username updated successfully") {
                    setEdit(false);
                    Alert.alert("Username updated successfully.")
                } else {
                    Alert.alert(resUser.message);
                }
            } catch (error) {
                Alert.alert("Error", "An error occurred while updating the username.");
            }
        }

        if (newEmail !== email) {
            try {
                const response = await fetch(`${API_URL}/api/user/changeEmail`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ new_email: newEmail }),
                });

                const resEmail = await response.json();

                if (resEmail.message === "Email updated successfully") {
                    setEdit(false);
                    Alert.alert("Success", "Email updated successfully.");
                } else if (resEmail.message === "email is already in use") {
                    Alert.alert("Email in use", "It appears the email you provided is already in use.");
                } else {
                    Alert.alert("Error", resEmail.message);
                }
            } catch (error) {
                Alert.alert("Error", "An error occurred while updating the email.");
            }
        }

        if (newPhone !== phone) {
            try {
                const response = await fetch(`${API_URL}/api/user/changePhone`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ new_phone: newPhone }),
                });

                const resPhone = await response.json();

                if (resPhone.message === "Phone number updated successfully") {
                    setEdit(false);
                    Alert.alert("Phone number updated successfully.");
                } else {
                    Alert.alert(resPhone.message);
                }
            } catch (error) {
                Alert.alert("Error", "An error occurred while updating the phone number.");
            }
        }

        if (newPassword !== "") {
            try {
                const response = await fetch(`${API_URL}/api/user/changePassword`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
                });

                const resPass = await response.json();

                if (resPass.message === "Password updated successfully") {
                    setEdit(false);
                    Alert.alert("Password changed successfully.");
                } else {
                    Alert.alert(resPass.message);
                }
            } catch (error) {
                Alert.alert("Error", "An error occurred while changing the password.");
            }
        }
    };

    const clearReducers = () => {
        const authState = { ...initialAuthState };
        dispatch(updateAuthState(authState));
        dispatch(resetAppWrapper());
        dispatch(clearProjectState());
        dispatch(clearSearchParamsState());
        dispatch(clearJourneyFormState());
        dispatch(clearCache());
        dispatch(clearMessageCache());
        dispatch(clearChatState());
        dispatch(clearBytesState());
        dispatch(clearHeartsState());
    };


    const deleteUserAccount = async () => {
        clearReducers();

        try {
            const response = await fetch(`${API_URL}/api/user/deleteUserAccount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });

            const res = await response.json();

            if (!res || !res.message) {
                const alive = await AsyncStorage.getItem('alive');
                if (!alive) {
                    Alert.alert(
                        "Server Error",
                        "We are unable to connect with the GIGO servers at this time. We're sorry for the inconvenience!"
                    );
                }
                return;
            }

            if (res.message !== "Account has been deleted.") {
                const alive = await AsyncStorage.getItem('alive');
                if (!alive) {
                    Alert.alert(
                        "Server Error",
                        res.message !== "internal server error occurred"
                            ? res.message
                            : "An unexpected error has occurred. We're sorry, we'll get right on that!"
                    );
                }
                return;
            }

            Alert.alert("User has been deleted.", "You will be redirected to the login page in a few.");
            navigation.navigate("Login"); // Use your appropriate navigation method to redirect

            const persistOptions = {};
            persistStore(store, persistOptions).purge();

            await AsyncStorage.setItem("homeIndex", "undefined");
        } catch (error) {
            Alert.alert("Error", "An error occurred while deleting the user account.");
        }
    };

    const getPortalLink = async () => {
        setPortalLinkLoading(true)

        let name = fetch(`${API_URL}/api/stripe/portalSession`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })

        if (!name.ok){
            console.log("response here is: ", name)
            throw new Error('Network response was not ok');
        }
        const res = await name.json();

        setPortalLinkLoading(false)

        if (res !== undefined && res["session"] !== undefined) {
            window.location.replace(res["session"])
            // setPortalLink(res["session"])
        }
    }

    const stripeNavigate = async (yearly: boolean | null) => {

        let stripe = fetch(`${API_URL}/api/stripe/premiumMembershipSession`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })

        if (!stripe.ok){
            console.log("response here is: ", stripe)
            throw new Error('Network response was not ok');
        }
        const res = await stripe.json();

        if (res["message"] === "You must be logged in to access the GIGO system.") {
            let authState = Object.assign({}, initialAuthStateUpdate)
            // @ts-ignore
            dispatch(updateAuthState(authState))
              navigation.navigate('Login')
        }
        if (res !== undefined && res["return url"] !== undefined && res["return year"] !== undefined) {
        //todo figure out how to change this for app
            if (yearly != null && yearly) {
                window.location.replace(res["return year"])
            } else {
                window.location.replace(res["return url"])
            }
        }
    }

    const handleCloseAgree = (yearly: boolean | null) => {
        if (hasSubscriptionId) {
            getPortalLink()
        } else {
            stripeNavigate(yearly)
        }
        setOpen(false)
    }

    const checkUserHoliday = async () => {
    console.log("1")
        try {
            console.log("2")
            const response = await fetch(`${API_URL}/api/user/get`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            console.log("hello we are here")

            if (!response.ok) {
                console.log("response here is: ", response)
                throw new Error('Network response was not ok');
            }

            const res = await response.json();

            setHolidayPref(res.user.holiday_themes);
        } catch (error) {
            console.log("error is: ", error)
            Alert.alert("Error", "There has been an issue loading holiday preferences. Please try again later.");
        }
    };

    const editWorkspace = async () => {
        console.log("in edit workspace")
        if (workspaceCommitMessage === "") {
            Alert.alert("Please enter a commit message.");
            return;
        }

        const updateInterval = parseInt(workspaceUpdateInterval, 10);

        if (isNaN(updateInterval)) {
            Alert.alert("Invalid Input", "Update interval must be a valid number.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/user/updateWorkspace`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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
                            timeZone: workspaceTimeZone
                        }
                    }
                })
            });

            const res = await response.json();
            console.log("workspace response: ", res)

            if ("message" in res) {
                const message = res.message;
                if (message === "workspace settings edited successfully") {
                    Alert.alert("Success", "Your workspace settings were edited successfully.", "success");
                } else {
                    Alert.alert("Server Error", "An error occurred editing your workspace settings.", "error");
                }
            } else {
                Alert.alert("Server Error", "An error occurred editing your workspace settings.", "error");
            }
        } catch (error) {
            Alert.alert("Network Error", "An error occurred editing your workspace settings. Please try again later.", "error");
        }
    };

    useEffect(() => {
        const loadSessionData = async () => {
            try {
                const storedValue = await AsyncStorage.getItem('accountsPage');
                if (storedValue !== null && storedValue === 'membership') {
                    setTab('membership');
                    setMembershipType('info');
                }
                await AsyncStorage.removeItem('accountsPage');
            } catch (error) {
                console.error('Error reading session data', error);
            }

            setLoading(true);
            await apiLoad();
            setLoading(false);
            checkUserHoliday();
        };

        loadSessionData();
    }, []);

    const apiLoad = async () => {
        console.log("within the api load")
//         let follow = call(
//             "/api/user/subscription",
//             "post",
//             null,
//             null,
//             null,
//             //@ts-ignore
//             {},
//             null,
//             config.rootPath
//         )
        let followResponse = await fetch(`${API_URL}/api/user/subscription`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        })

        if (!followResponse.ok){
            console.log("follow response is: ", followResponse.ok)
            throw new Error('Network response was not ok')
        }

        const res = await followResponse.json()
        console.log("res is: ", res)

        setMembership(res["current_subscription"])
        setMembershipCost(res["payment"])
        setMembershipDates({
            start: res["membershipStart"],
            last: res["lastPayment"],
            upcoming: res["upcomingPayment"]
        })
        setInTrial(res["inTrial"])
        setHasPaymentInfo(res["hasPaymentInfo"])
        setHasSubscriptionId(res["hasSubscription"])
        setAlreadyCancelled(res["alreadyCancelled"])
        setSubscription(res)

        if (userInfo === null) {
//             let name = call(
//                 "/api/user/get",
//                 "post",
//                 null,
//                 null,
//                 null,
//                 //@ts-ignore
//                 {},
//                 null,
//                 config.rootPath
//             )
//
//             const [res] = await Promise.all([
//                 name,
//             ])

            let nameResponse = await fetch(`${API_URL}/api/user/get`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({})
            })

            if (!nameResponse.ok){
                throw new Error('Network response was not ok')
            }

            const response = await nameResponse.json()
            console.log("response in workspace update: ", response)

            if (response !== undefined && response["user"] !== undefined) {
                console.log("update interval: ", response["user"]["workspace_settings"]["auto_git"]["updateInterval"])
                setUserInfo(response["user"])
                setNewUsername(response["user"]["user_name"])
                setNewEmail(response["user"]["email"])
                setNewPhone(response["user"]["phone"])
                setWorkspaceRunStart(response["user"]["workspace_settings"]["auto_git"]["runOnStart"])
                setWorkspaceUpdateInterval(response["user"]["workspace_settings"]["auto_git"]["updateInterval"])
                setWorkspaceLogging(response["user"]["workspace_settings"]["auto_git"]["logging"])
                setWorkspaceSilent(response["user"]["workspace_settings"]["auto_git"]["silent"])
                setWorkspaceCommitMessage(response["user"]["workspace_settings"]["auto_git"]["commitMessage"])
                setWorkspaceLocale(response["user"]["workspace_settings"]["auto_git"]["locale"])
                setWorkspaceTimeZone(response["user"]["workspace_settings"]["auto_git"]["timeZone"]);
                (response["user"]["avatar_settings"]) !== null ? setAttributes(response["user"]["avatar_settings"]) : setAttributes(Attributes);
                (response["user"]["stripe_account"]) !== undefined ? setStripeAccount(response["user"]["stripe_account"]) : setStripeAccount("")
            }
        }
    }

    const userTab = () => {
        return (
            <View style={styles.centeredView}>
                <View style={styles.contentWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor="#888" // Placeholder color
                        value={newUsername}
                        editable={edit}
                        onChangeText={setNewUsername}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#888" // Placeholder color
                        value={newEmail}
                        editable={edit}
                        onChangeText={setNewEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        placeholderTextColor="#888" // Placeholder color
                        value={newPhone}
                        editable={edit}
                        onChangeText={setNewPhone}
                    />
                    {edit && (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#888" // Placeholder color
                                secureTextEntry
                                onChangeText={setOldPassword}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="New Password"
                                placeholderTextColor="#888" // Placeholder color
                                secureTextEntry
                                onChangeText={setNewPassword}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Re-Type New Password"
                                placeholderTextColor="#888" // Placeholder color
                                secureTextEntry
                                onChangeText={setConfirmPassword}
                            />
                            <View style={styles.buttonRow}>
                                <Button title="Cancel" onPress={() => setEdit(false)} color="red" />
                                <Button title="Submit" onPress={editUser} />
                            </View>
                        </>
                    )}
                    {!edit && (
                        <Button title="Edit User Details" onPress={() => setEdit(true)} style={styles.editUserButton}/>
                    )}
                    <View style={{ marginTop: 15 }}>
                        <Button title="Delete Account" color="red" onPress={() => setDeleteAccount(true)} />
                        <Portal>
                            <Dialog visible={deleteAccount} onDismiss={() => setDeleteAccount(false)}>
                                <Dialog.Title>Delete Account</Dialog.Title>
                                <Dialog.Content>
                                    <Text style={styles.dialogText}>Are you sure you want to delete your account?</Text>
                                    <Text style={styles.dialogText}>Account deletion is permanent and cannot be undone. If you delete your account, you will lose all of your work.</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Type Confirm"
                                        placeholderTextColor="#888" // Placeholder color
                                        value={confirmDeletionContent}
                                        onChangeText={setConfirmDeletionContent}
                                    />
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <Button title="Cancel" onPress={() => setDeleteAccount(false)} />
                                    <Button
                                        title="Confirm"
                                        color="red"
                                        onPress={deleteUserAccount}
                                        disabled={confirmDeletionContent.toLowerCase() !== 'confirm'}
                                    />
                                </Dialog.Actions>
                            </Dialog>
                        </Portal>
                    </View>
                </View>
            </View>
        );
    };

    const exclusiveContentLink = async () => {
        setConnectedAccountLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/stripe/createConnectedAccount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });

            const res = await response.json();

            setConnectedAccountLoading(false);

            if (res !== undefined && res.account !== undefined) {
                Linking.openURL(res.account);
            }
        } catch (error) {
            setConnectedAccountLoading(false);
            console.log("error is: ", error)
            Alert.alert("Error", "An error occurred while creating the connected account.");
        }
    };

    const exclusiveContentUpdateLink = async () => {
        setConnectedAccountLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/stripe/updateConnectedAccount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });

            const res = await response.json();

            setConnectedAccountLoading(false);

            if (res !== undefined && res.account !== undefined) {
                Linking.openURL(res.account);
            }
        } catch (error) {
            setConnectedAccountLoading(false);
            Alert.alert("Error", "An error occurred while updating the connected account.");
        }
    };

    const UnixDateConverter = (unixTimestamp) => {
        let date = new Date(unixTimestamp * 1000);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        return day === 0 ? "N/A" : `${month}/${day}/${year}`;
    };

    const formatDate = (timestamp: number | null) => {
        return timestamp === 0 || timestamp === null ? "N/A" : UnixDateConverter(timestamp); // UnixDateConverter function is not defined, replace it with your date formatting logic
    };

    const membershipTab = () => {
        const formatDate = (timestamp: number | null) => {
            return timestamp === 0 || timestamp === null ? "N/A" : UnixDateConverter(timestamp);
        };

        let percentageOfMembership = 0;
        if (membershipDates["last"] && membershipDates["last"] > 0 && membershipDates["upcoming"] && membershipDates["upcoming"] > 0) {
            percentageOfMembership = ((new Date().getTime() / 1000) - membershipDates["last"]) / (membershipDates["upcoming"] - membershipDates["last"])
        }
        return (
            <View style={{ width: "100%", paddingTop: "100px" }}>
                <Text style={{ fontSize: 24, textAlign: 'left', color: "white", paddingBottom: 10, paddingTop: 20 }}>
                    {`Membership Level  `}
                    <Text style={{
                        fontWeight: '200',
                        marginLeft: 15,
                        textTransform: "none",
                    }}>
                        {subscription?.current_subscription_string || "Free"}
                    </Text>
                    {membership === 0 && (
                        <Text
                            style={{
                                fontWeight: '150',
                                textTransform: "none",
                                fontSize: 12,
                                marginLeft: 3
                            }}
                        >
                            (lame)
                        </Text>
                    )}
                    {membership > 0 && inTrial && (!hasPaymentInfo || alreadyCancelled) && (
                        <Text
                            style={{
                                fontWeight: '200',
                                textTransform: "none",
                                fontSize: 14,
                                marginLeft: 3
                            }}
                        >
                            trial
                        </Text>
                    )}
                    {membership > 0 && !inTrial && (!hasPaymentInfo || alreadyCancelled) && (
                        <Text
                            style={{
                                fontWeight: '200',
                                textTransform: "none",
                                fontSize: 14,
                                marginLeft: 3
                            }}
                        >
                            cancelled
                        </Text>
                    )}
                </Text>
                <Card style={{ borderRadius: 10, borderColor: "#29c18c", borderWidth: 1, backgroundColor: "transparent", paddingBottom: 5 }}>
                    {membership > 0 ? (
                        <View style={styles.containerMembership}>
                            <Text style={styles.titleMembership}>Membership Details</Text>
                            <View style={styles.progressContainerMembership}>
                                <View style={styles.progressBarMembership}>
                                    <View style={[styles.progressFillMembership, { width: `${percentageOfMembership * 100}%` }]} />
                                </View>
                            </View>
                            <View style={styles.detailsContainerMembership}>
                                <View style={styles.detailItemMembership}>
                                    <Text style={styles.detailTitleMembership}>{inTrial ? "Trial Start" : "Last Payment"}</Text>
                                    <Text style={styles.detailTextMembership}>{formatDate(membershipDates["last"])}</Text>
                                </View>
                                <View style={styles.detailItemMembership}>
                                    <Text style={styles.detailTitleMembership}>{inTrial && !hasPaymentInfo ? "Trial End" : alreadyCancelled ? "End of Pro Access" : subscription?.scheduledDowngrade ? `Downgrade To ${proStatusToString(subscription?.scheduledDowngrade)}` : "Next Payment"}</Text>
                                    <Text style={styles.detailTextMembership}>{formatDate(membershipDates["upcoming"])}</Text>
                                </View>
                            </View>
                            <View style={styles.paymentContainerMembership}>
                                {(!inTrial || hasPaymentInfo) && !alreadyCancelled && (
                                    <View style={styles.paymentItemMembership}>
                                        <Text style={styles.paymentTextMembership}>{`Next ${membershipCost === "80.00" ? "Yearly" : "Monthly"} Payment`}</Text>
                                        <Text style={styles.paymentTextMembership}>{`$${membershipCost}`}</Text>
                                    </View>
                                )}
                                <View style={styles.paymentItemMembership}>
                                    <Text style={styles.paymentTextMembership}>Membership Start Date</Text>
                                    <Text style={styles.paymentTextMembership}>{formatDate(membershipDates["start"])}</Text>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.exclusiveContainer}>
                          <Text style={styles.exclusiveTitle}>Why Go Pro?</Text>
                          <View style={styles.exclusiveCardContainer}>
                            <Card style={styles.exclusiveCard}>
                              <Card.Title titleStyle={styles.exclusiveCardContentTitle} subtitleNumberOfLines={0} titleNumberOfLines={0} subtitleStyle={styles.exclusiveCardContentSubtitle} title="Code Teacher" subtitle="Your personal AI tutor." />
                              <Card.Content>
                                <Text style={styles.exclusiveContentText}>
                                  Get smarter Code Teacher to learn faster and more efficiently. Take advantage of your personal AI tutor to understand code and fix errors.
                                </Text>
                              </Card.Content>
                            </Card>
                            <Card style={styles.exclusiveCard}>
                              <Card.Title titleStyle={styles.exclusiveCardContentTitle} subtitleNumberOfLines={0} titleNumberOfLines={0} subtitleStyle={styles.exclusiveCardContentSubtitle} title="Private Projects" subtitle="Learn in stealth mode." />
                              <Card.Content>
                                <Text style={styles.exclusiveContentText}>
                                  Create private projects that are accessible only to you.
                                </Text>
                              </Card.Content>
                            </Card>
                            <Card style={styles.exclusiveCard}>
                              <Card.Title titleStyle={styles.exclusiveCardContentTitle} subtitleNumberOfLines={0} titleNumberOfLines={0} subtitleStyle={styles.exclusiveCardContentSubtitle} title="More DevSpace Resources" subtitle="8 CPU cores, 8GB RAM, 50GB disk space." />
                              <Card.Content>
                                <Text style={styles.exclusiveContentText}>
                                  Increased CPU and memory allocation for running larger and more complex projects.
                                </Text>
                              </Card.Content>
                            </Card>
                            <Card style={styles.exclusiveCard}>
                              <Card.Title titleStyle={styles.exclusiveCardContentTitle} subtitleNumberOfLines={0} titleNumberOfLines={0} subtitleStyle={styles.exclusiveCardContentSubtitle} title="Concurrent DevSpaces" subtitle="Run up to 3 DevSpaces at once." />
                              <Card.Content>
                                <Text style={styles.exclusiveContentText}>
                                  Run multiple DevSpaces at the same time for efficient multitasking.
                                </Text>
                              </Card.Content>
                            </Card>
                            <Card style={styles.exclusiveCard}>
                              <Card.Title titleStyle={styles.exclusiveCardContentTitle} subtitleNumberOfLines={0} titleNumberOfLines={0} subtitleStyle={styles.exclusiveCardContentSubtitle} title="Streak Freezes" subtitle="Preserve your streak." />
                              <Card.Content>
                                <Text style={styles.exclusiveContentText}>
                                  Get 2 streak freezes a week to maintain your learning streak on days you don't log on.
                                </Text>
                              </Card.Content>
                            </Card>
                            <Card style={styles.exclusiveCard}>
                              <Card.Title titleStyle={styles.exclusiveCardContentTitle} subtitleNumberOfLines={0} titleNumberOfLines={0} subtitleStyle={styles.exclusiveCardContentSubtitle} title="Premium VSCode Theme" subtitle="Code like a pro." />
                              <Card.Content>
                                <Text style={styles.exclusiveContentText}>
                                  Access to an exclusive Visual Studio Code theme to enhance your development experience.
                                </Text>
                              </Card.Content>
                            </Card>
                          </View>
                        </View>
                    )}
                </Card>
            </View>
        );
    };

    const handleSubmit = async () => {
        setWsSettingsLoading(true);
        await editWorkspace();
        setWsSettingsLoading(false);
    }

    const handleInputChange = (text, setter) => {
        setter(text);
    };

    const exclusiveContentTab = () => {
        return (
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <Text style={styles.titleExclusive}>Exclusive Content</Text>
                    <View style={styles.card}>
                        <Text style={styles.subtitleExclusive}>Account Connection Status:</Text>
                        <Text style={styles.textExclusive}>{stripeAccount === "" ? "Not Connected" : "Connected"}</Text>
                        {stripeAccount !== "" ? (
                            <Button title="Update Connected Account" onPress={exclusiveContentUpdateLink} />
                        ) : (
                            <TouchableOpacity onPress={exclusiveContentLink} style={{borderColor: '#29c18c', borderWidth: 1, borderRadius: 5, padding: 5, alignItems: "center"}}>
                                <Text style={{color: "#29c18c"}}>
                                    Connect Account
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <Text style={styles.sectionTitleExclusive}>Why do I have to set this up?</Text>
                    <Text style={styles.paragraphExclusive}>
                        Exclusive content creators sell their challenges on GIGO for fixed prices. This helps GIGO provide more detailed and diverse content and rewards content creators for their work.
                    </Text>
                    <Text style={styles.paragraphExclusive}>
                        GIGO uses Stripe Connected Accounts to compensate creators when users purchase exclusive content. In order for you to begin creating exclusive content, you must first set up your Stripe Connected Account.
                    </Text>
                    <Text style={styles.sectionTitleExclusive}>What Is Exclusive Content?</Text>
                    <Text style={styles.paragraphExclusive}>
                        Exclusive coding projects are unique, premium programming challenges or assignments that users can access by paying a fee. These projects are designed to provide a stimulating and rewarding learning experience, allowing users to develop and hone their coding skills by working on real-world problems or innovative ideas.
                    </Text>
                    <Text style={styles.sectionTitleExclusive}>How to Create Exclusive Content</Text>
                    <View style={styles.exclusiveBulletsContainer}>
                      <Text style={styles.exclusiveBulletsParagraph}>
                        Creating exclusive content is easy, but it is important to know that the standard for a challenge being worthy of being exclusive is higher than general content. Before being able to make any exclusive content, you must also create a connected account for you to receive money into.
                      </Text>
                      <View style={styles.exclusiveBulletsListContainer}>
                        <Text style={styles.exclusiveBulletsListItem}>
                          <Text style={styles.bullet}>• </Text>Create a connected account by either going to account settings or clicking the 'Setup Exclusive Content Account' button below.
                        </Text>
                        <Text style={styles.exclusiveBulletsListItem}>
                          <Text style={styles.bullet}>• </Text>Once you have created a connected account, you can get started by clicking the 'Create Exclusive Content' button below.
                        </Text>
                        <Text style={styles.exclusiveBulletsListItem}>
                          <Text style={styles.bullet}>• </Text>When you get serious about creating exclusive content, click the 'Don't Show Me This Page Again' button below and submit it.
                        </Text>
                        <Text style={styles.exclusiveBulletsListItem}>
                          <Text style={styles.bullet}>• </Text>Just know, once you hit that button you will only be able to get to this page through the About page.
                        </Text>
                        <Text style={styles.exclusiveBulletsListItem}>
                          <Text style={styles.bullet}>• </Text>After you have confirmed to have read this page, clicking the 'Exclusive Content' button in the top menu will take you straight to creating exclusive content.
                        </Text>
                      </View>
                    </View>
                </View>
            </ScrollView>
        );
    };

      const handleSwitchChange = (value, setStateFunction) => {
        console.log("value is: ", value)
        setStateFunction(value);
      };

    const workspaceTab = () => {
        return (
        <ScrollView style={styles.workspaceContainer}>
            <Text style={styles.workspaceTitle}>Workspace Settings</Text>
            <View style={styles.workspaceCard}>
                <Text style={styles.workspaceSectionTitle}>Auto Git</Text>
                <View style={styles.workspaceSwitchRow}>
                    <View style={styles.workspaceSwitchItem}>
                        <Switch
                            value={workspaceRunStart}
                            onValueChange={(value) => handleSwitchChange(value, setWorkspaceRunStart)}
                        />
                        <Text style={styles.workspaceSwitchLabel}>Toggle Auto Git system inside DevSpaces</Text>
                    </View>
                    <View style={styles.workspaceSwitchItem}>
                        <Switch
                            value={workspaceLogging}
                            onValueChange={(value) => handleSwitchChange(value, setWorkspaceLogging)}
                            disabled={!workspaceRunStart}
                        />
                        <Text style={styles.workspaceSwitchLabel}>Whether Auto Git will log commits to a local file</Text>
                    </View>
                    <View style={styles.workspaceSwitchItem}>
                        <Switch
                            value={workspaceSilent}
                            onValueChange={(value) => handleSwitchChange(value, setWorkspaceSilent)}
                            disabled={!workspaceRunStart}
                        />
                        <Text style={styles.workspaceSwitchLabel}>Disable alert popups for Auto Git actions</Text>
                    </View>
                    <View style={styles.workspaceSwitchItem}>
                        <TextInput
                            style={styles.workspaceTextInput}
                            value={workspaceUpdateInterval.toString()}
                            onChangeText={(text) => handleInputChange(text, setWorkspaceUpdateInterval)}
                            placeholder="Update Interval"
                            editable={workspaceRunStart}
                                                        placeholderTextColor="white"
                        />
                        <Text style={styles.workspaceSwitchLabel}>How frequently in seconds Auto Git will commit changes</Text>
                    </View>
                    <View style={styles.workspaceSwitchItem}>
                        <TextInput
                            style={styles.workspaceTextInput}
                            value={workspaceCommitMessage}
                            onChangeText={(text) => handleInputChange(text, setWorkspaceCommitMessage)}
                            placeholder="Commit Message"
                            editable={workspaceRunStart}
                                                        placeholderTextColor="white"
                        />
                        <Text style={styles.workspaceSwitchLabel}>Commit message that will be used by Auto Git</Text>
                    </View>
                    <View style={styles.workspaceSwitchItem}>
                        <TextInput
                            style={styles.workspaceTextInput}
                            value={workspaceLocale}
                            onChangeText={(text) => handleInputChange(text, setWorkspaceLocale)}
                            placeholder="Locale"
                            editable={workspaceRunStart}
                                                        placeholderTextColor="white"
                        />
                        <Text style={styles.workspaceSwitchLabel}>Locale to be used by Auto Git in commit messages</Text>
                    </View>
                    <View style={styles.workspaceSwitchItem}>
                        <TextInput
                            style={styles.workspaceTextInput}
                            value={workspaceTimeZone}
                            onChangeText={(text) => handleInputChange(text, setWorkspaceTimeZone)}
                            placeholder="Time Zone"
                            editable={workspaceRunStart}
                            placeholderTextColor="white"
                        />
                        <Text style={styles.workspaceSwitchLabel}>Timezone used for Auto Git's log file</Text>
                    </View>
                </View>
            </View>
            <Text style={styles.workspaceSectionTitle}>Editor</Text>
            <View style={styles.workspaceSwitchRow}>
                <Switch
                    value={holidayPref}
                    onValueChange={(value) => handleSwitchChange(value, setHolidayPref)}
                />
                <Text style={styles.workspaceSwitchLabel}>Toggle holiday themes in the editor</Text>
            </View>
            <TouchableOpacity
                style={styles.workspaceSubmitButton}
                onPress={handleSubmit}
            >
                <Text style={styles.workspaceSubmitButtonText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
        );
    };

    const tabDetermination = () => {
    console.log("here")
        switch (tab) {
            case "user":
                return userTab();
            case "workspace settings":
                return workspaceTab();
            case "membership":
                return membershipTab();
            case "exclusive content setup":
                return exclusiveContentTab();
            default:
                return avatarTab();
        }
    };

    return (
        <PaperProvider>
            <View style={styles.mainContainer}>
                <View style={styles.tabsContainer}>
                    <TouchableOpacity onPress={() => setTab("user")} style={tab === "user" ? styles.tabButtonClicked : styles.tabButton}>
                        <Text style={ tab === "user" ? styles.tabTextClicked : styles.tabText}>User</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTab("workspace settings")} style={tab === "workspace settings" ? styles.tabButtonClicked : styles.tabButton}>
                        <Text style={ tab === "workspace settings" ? styles.tabTextClicked : styles.tabText}>Workspace Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTab("membership")} style={tab === "membership" ? styles.tabButtonClicked : styles.tabButton}>
                        <Text style={ tab === "membership" ? styles.tabTextClicked : styles.tabText}>Membership</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTab("exclusive content setup")} style={tab === "exclusive content setup" ? styles.tabButtonClicked : styles.tabButton}>
                        <Text style={ tab === "exclusive content setup" ? styles.tabTextClicked : styles.tabText}>Exclusive Content Setup</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.contentContainer}>{tabDetermination()}</ScrollView>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#1c1c1a", // black background
        flexDirection: 'row',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'flex-start', // Change this if you want to align items at the start
        alignItems: 'center',
    },
    contentWrapper: {
        paddingTop: 50, // Adjust the padding as needed to move content down
        width: '100%',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
        backgroundColor: "#1c1c1a", // black background
    },
    container: {
        flex: 1,
        backgroundColor: "#1c1c1a", // black background
        padding: 20,
        alignItems: "center",
    },
    input: {
        width: '80%',
        height: 50,
        marginBottom: 20,
        borderRadius: 10,
        borderWidth: 1,
        padding: 10,
        color: "white",
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderColor: "gray"
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "60%"
    },
    card: {
        padding: 20,
        borderWidth: 1,
        borderColor: '#27ab7c',
        borderRadius: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        color: '#00f', // blue text
        textShadowColor: '#00f', // blue outline
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    titleExclusive: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        color: 'white', // blue text
        textShadowColor: '#00f', // blue outline
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 5,
        color: '#00f', // blue text
        textShadowColor: '#00f', // blue outline
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    subtitleExclusive: {
        fontSize: 18,
        marginBottom: 5,
        color: 'white', // blue text
        textShadowColor: 'white', // blue outline
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
        color: '#00f', // blue text
        textShadowColor: '#00f', // blue outline
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    sectionTitleExclusive: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
        color: 'white', // blue text
        textShadowColor: 'white', // blue outline
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    paragraph: {
        fontSize: 16,
        marginBottom: 10,
        color: '#00f', // blue text
        textShadowColor: '#00f', // blue outline
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    paragraphExclusive: {
        fontSize: 16,
        marginBottom: 10,
        color: 'white', // blue text
        textShadowColor: '#white', // blue outline
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    tabsContainer: {
        width: '25%',
        backgroundColor: "#1c1c1a", // black background
        paddingVertical: 20,
    },
    tabButtonClicked: {
        padding: 10,
        borderRightWidth: 1,
        borderRightColor: "#29c18c",
        marginBottom: 10,
        width: "100%"
    },
    tabButton: {
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    tabText: {
        color: 'white', // blue text
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
        textAlign: 'center',
    },
    tabTextClicked: {
        color: "#29c18c", // blue text
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
        textAlign: 'center',
    },
    textExclusive: {
        fontSize: 16,
        marginBottom: 10,
        color: "white"
    },
    contentContainer: {
        flex: 1,
        backgroundColor: "#1c1c1a", // black background
        paddingHorizontal: 20
    },
    editUserButton: {
        borderRadius: 30,
        color: "green"
    },
    containerMembership: {
        marginTop: 20,
        paddingLeft: 10,
        paddingRight: 10
    },
    titleMembership: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },
    progressContainerMembership: {
        marginVertical: 10,
    },
    progressBarMembership: {
        height: 12,
        backgroundColor: '#E0E0E0',
        borderRadius: 15,
    },
    progressFillMembership: {
        height: 12,
        backgroundColor: '#2196F3',
        borderRadius: 15,
    },
    detailsContainerMembership: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    detailItemMembership: {
        flex: 1,
    },
    detailTitleMembership: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    detailTextMembership: {
        fontSize: 16,
        color: 'white',
    },
    paymentContainerMembership: {
        marginTop: 10,
    },
    paymentItemMembership: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    paymentTextMembership: {
        fontSize: 16,
        color: 'white',
    },
      exclusiveContainer: {
        flex: 1,
        padding: 10,
      },
      exclusiveTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: "#fff"
      },
      exclusiveCardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      },
      exclusiveCard: {
        width: '48%',
        marginBottom: 20,
        backgroundColor: '#282826'
      },
      exclusiveCardContent: {
        padding: 10,
      },
      exclusiveCardContentTitle: {
        color: '#fff', // White text color
        width: "100%",
        flexWrap: "wrap"
      },
      exclusiveCardContentSubtitle: {
        color: '#fff',
        fontSize: 11,
        width: "100%",
        height: "auto",
        lineHeight: 14, // adjust line height for better readability
        paddingBottom: 10
      },
      exclusiveCardContentText: {
        color: '#fff', // White text color
        fontSize: 12
      },
      exclusiveContentText: {
        fontSize: 14,
        color: '#fff', // White text color
      },
    workspaceContainer: {
        margin: 3,
        padding: 3,
    },
    workspaceTitle: {
        fontSize: 24,
        marginBottom: 16,
        color: 'white',
    },
    workspaceCard: {
        borderWidth: 1,
        borderColor: '#29c18c',
        borderRadius: 10,
        padding: 10,
        marginBottom: 16,
    },
    workspaceSectionTitle: {
        fontSize: 20,
        marginBottom: 8,
        textAlign: 'center',
        color: 'white',
    },
    workspaceSwitchRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    workspaceSwitchItem: {
        width: '48%',
    },
    workspaceSwitchLabel: {
        fontSize: 14,
        marginBottom: 8,
        color: 'white',
    },
    workspaceTextInput: {
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        padding: 8,
        marginBottom: 8,
        color: 'white',
        height: "auto",
        width: "105%"
    },
    workspaceSubmitButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#29c18c',
        borderRadius: 5,
        padding: 10,
        marginTop: 16,
    },
    workspaceSubmitButtonText: {
        textAlign: 'center',
        color: 'white',
    },
    connectButton: {
        color: "#29c18c"
    },
      exclusiveBulletsContainer: {
        marginVertical: 8,
        paddingHorizontal: 16,
      },
      exclusiveBulletsParagraph: {
        fontSize: 16,
        textAlign: 'left',
        marginBottom: 16,
        color: 'white', // Set text color to white
      },
      exclusiveBulletsListContainer: {
        marginLeft: 16,
        lineHeight: 24,
      },
      exclusiveBulletsListItem: {
        fontSize: 16,
        marginBottom: 8,
        color: 'white', // Set text color to white
      },
      bullet: {
        color: 'white', // Set bullet color to white
      },
});

export default AccountSettings;

