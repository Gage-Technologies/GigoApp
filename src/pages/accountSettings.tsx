import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Button } from 'react-native';
import { Dialog, Portal, Provider as PaperProvider } from 'react-native-paper';
import { TabView, SceneMap, TabBar } from 'react-native-paper';

const AccountSettings = () => {
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

    const editUser = () => {
        // Implement your edit user logic here
    };

    const deleteUserAccount = () => {
        // Implement your delete user account logic here
    };

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
        let res = await call("/api/stripe/createConnectedAccount", "post", null, null, null, {}, null, config.rootPath);
        setConnectedAccountLoading(false);
        if (res !== undefined && res.account !== undefined) {
            window.location.replace(res.account);
        }
    };

    const exclusiveContentUpdateLink = async () => {
        setConnectedAccountLoading(true);
        let res = await call("/api/stripe/updateConnectedAccount", "post", null, null, null, {}, null, config.rootPath);
        setConnectedAccountLoading(false);
        if (res !== undefined && res.account !== undefined) {
            window.location.replace(res.account);
        }
    };

    const UnixDateConverter = (unixTimestamp) => {
        let date = new Date(unixTimestamp * 1000);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        return day === 0 ? "N/A" : `${month}/${day}/${year}`;
    };

    const exclusiveContentTab = () => {
        return (
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <Text style={styles.title}>Exclusive Content</Text>
                    <View style={styles.card}>
                        <Text style={styles.subtitle}>Account Connection Status:</Text>
                        <Text style={styles.text}>{stripeAccount === "" ? "Not Connected" : "Connected"}</Text>
                        {stripeAccount !== "" ? (
                            <Button title="Update Connected Account" onPress={exclusiveContentUpdateLink} />
                        ) : (
                            <Button title="Connect Account" onPress={exclusiveContentLink} />
                        )}
                    </View>
                    <Text style={styles.sectionTitle}>Why do I have to set this up?</Text>
                    <Text style={styles.paragraph}>
                        Exclusive content creators sell their challenges on GIGO for fixed prices. This helps GIGO provide more detailed and diverse content and rewards content creators for their work.
                    </Text>
                    <Text style={styles.paragraph}>
                        GIGO uses Stripe Connected Accounts to compensate creators when users purchase exclusive content. In order for you to begin creating exclusive content, you must first set up your Stripe Connected Account.
                    </Text>
                    <Text style={styles.sectionTitle}>What Is Exclusive Content?</Text>
                    <Text style={styles.paragraph}>
                        Exclusive coding projects are unique, premium programming challenges or assignments that users can access by paying a fee. These projects are designed to provide a stimulating and rewarding learning experience, allowing users to develop and hone their coding skills by working on real-world problems or innovative ideas.
                    </Text>
                    <Text style={styles.sectionTitle}>How to Create Exclusive Content</Text>
                    <Text style={styles.paragraph}>
                        Creating exclusive content is easy, but it is important to know that the standard for a challenge being worthy of being exclusive is higher than general content. Before being able to make any exclusive content, you must also create a connected account for you to receive money into.
                    </Text>
                </View>
            </ScrollView>
        );
    };

    const tabDetermination = () => {
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
                    <TouchableOpacity onPress={() => setTab("user")} style={styles.tabButton}>
                        <Text style={styles.tabText}>User</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTab("workspace settings")} style={styles.tabButton}>
                        <Text style={styles.tabText}>Workspace Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTab("membership")} style={styles.tabButton}>
                        <Text style={styles.tabText}>Membership</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTab("exclusive content setup")} style={styles.tabButton}>
                        <Text style={styles.tabText}>Exclusive Content Setup</Text>
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
        backgroundColor: '#000', // black background
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
        backgroundColor: '#000', // black background
    },
    container: {
        flex: 1,
        backgroundColor: '#000', // black background
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
    },
    card: {
        padding: 20,
        borderWidth: 1,
        borderColor: "gray",
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
    subtitle: {
        fontSize: 18,
        marginBottom: 5,
        color: '#00f', // blue text
        textShadowColor: '#00f', // blue outline
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
    paragraph: {
        fontSize: 16,
        marginBottom: 10,
        color: '#00f', // blue text
        textShadowColor: '#00f', // blue outline
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    tabsContainer: {
        width: '20%',
        backgroundColor: '#000', // black background
        paddingVertical: 20,
    },
    tabButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#00f",
        borderRadius: 5,
        marginBottom: 10,
    },
    tabText: {
        color: 'white', // blue text
        textShadowColor: '#00f', // blue outline
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
        textAlign: 'center',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#000', // black background
        paddingHorizontal: 20,
    },
    editUserButton: {
        borderRadius: 30,
        color: "green"
    }
});

export default AccountSettings;

