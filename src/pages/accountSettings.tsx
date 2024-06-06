import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Button, Switch } from 'react-native';
import { Dialog, Portal, Provider as PaperProvider } from 'react-native-paper';
import { TabView, SceneMap, TabBar, Card } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

const AccountSettings = () => {
    const theme = useTheme();
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
    const [membership, setMembership] = React.useState(2)
    const [membershipType, setMembershipType] = React.useState("info")
    const [loading, setLoading] = React.useState(false)
    const [subscription, setSubscription] = React.useState<Subscription | null>(null)
    const [inTrial, setInTrial] = React.useState(false)
    const [hasPaymentInfo, setHasPaymentInfo] = React.useState(false)

    const updateHoliday = () => {
        setHolidayPref(!holidayPref);
    };

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

    const formatDate = (timestamp: number | null) => {
        return timestamp === 0 || timestamp === null ? "N/A" : UnixDateConverter(timestamp); // UnixDateConverter function is not defined, replace it with your date formatting logic
    };

    const renderMembershipContent = () => {
        return (
            <View style={{ width: "100%" }}>
                <Text style={{ fontSize: 24, textAlign: 'left' }}>
                    {`Membership Level`}
                    <Text style={{
                        fontWeight: '200',
                        marginLeft: 15,
                        textTransform: "none"
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
                <Card style={{ borderRadius: 10, borderColor: theme.colors.background, backgroundColor: "transparent" }}>
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
                        <ScrollView>
                            <Text style={{ fontSize: 24, textAlign: 'center' }}>
                                Why Go Pro?
                            </Text>
                            {/* Card items */}
                        </ScrollView>
                    )}
                </Card>
            </View>
        );
    };

    const membershipTab = () => {
        const formatDate = (timestamp: number | null) => {
            return timestamp === 0 || timestamp === null ? "N/A" : UnixDateConverter(timestamp);
        };

        let percentageOfMembership = 0;
        if (membershipDates["last"] && membershipDates["last"] > 0 && membershipDates["upcoming"] && membershipDates["upcoming"] > 0) {
            percentageOfMembership = ((new Date().getTime() / 1000) - membershipDates["last"]) / (membershipDates["upcoming"] - membershipDates["last"])
        }

        const MembershipDetails = () => {
            return (
                <ScrollView>
                    <Text style={{ fontSize: 20, textAlign: 'center' }}>
                        Membership Details
                    </Text>
                    {/* Render membership details */}
                </ScrollView>
            );
        };

        return (
            <View style={{ margin: 3, padding: 3, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                {membershipType === "info" ? (
                    loading ? (
                        <ActivityIndicator />
                    ) : (
                        <View style={{ width: "100%" }}>
                            <Text style={{ fontSize: 24, textAlign: 'left' }}>
                                {`Membership Level`}
                                <Text style={{
                                    fontWeight: '200',
                                    marginLeft: 15,
                                    textTransform: "none"
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
                            <Card style={{ borderRadius: 10, borderColor: theme.colors.background, backgroundColor: "transparent" }}>
                                {membership > 0 ? (
                                    <MembershipDetails />
                                ) : (
                                    <View>
                                        <Text style={{ fontSize: 24, textAlign: 'center' }}>
                                            Why Go Pro?
                                        </Text>
                                        {/* Render other membership details */}
                                    </View>
                                )}
                            </Card>
                        </View>
                    )
                ) : (
                    <Text style={{ fontSize: 20, textAlign: 'center', color: 'red' }}>
                        There was an issue with this action, please try again later.
                    </Text>
                )}
            </View>
        );
    };

    const handleSubmit = async () => {
        setWsSettingsLoading(true);
        await editWorkspace();
        setWsSettingsLoading(false);
    }

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
                            <Button title="Connect Account" onPress={exclusiveContentLink} />
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
                    <Text style={styles.paragraphExclusive}>
                        Creating exclusive content is easy, but it is important to know that the standard for a challenge being worthy of being exclusive is higher than general content. Before being able to make any exclusive content, you must also create a connected account for you to receive money into.
                    </Text>
                </View>
            </ScrollView>
        );
    };

    const workspaceTab = () => {
        return (
        <ScrollView style={{ margin: 3, padding: 3 }}>
            <Text style={{ fontSize: 24, marginBottom: 16 }}>Workspace Settings</Text>
            <View style={{ borderWidth: 1, borderColor: 'lightgray', borderRadius: 10, padding: 10, marginBottom: 16 }}>
                <Text style={{ fontSize: 20, marginBottom: 8, textAlign: 'center' }}>Auto Git</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <View style={{ width: '48%' }}>
                        <Switch
                            value={workspaceRunStart}
                            onValueChange={(value) => handleSwitchChange(value, setWorkspaceRunStart)}
                        />
                        <Text style={{ fontSize: 14, marginBottom: 8 }}>Toggle Auto Git system inside DevSpaces</Text>
                    </View>
                    <View style={{ width: '48%' }}>
                        <Switch
                            value={workspaceLogging}
                            onValueChange={(value) => handleSwitchChange(value, setWorkspaceLogging)}
                            disabled={!workspaceRunStart}
                        />
                        <Text style={{ fontSize: 14, marginBottom: 8 }}>Whether Auto Git will log commits to a local file</Text>
                    </View>
                    <View style={{ width: '48%' }}>
                        <Switch
                            value={workspaceSilent}
                            onValueChange={(value) => handleSwitchChange(value, setWorkspaceSilent)}
                            disabled={!workspaceRunStart}
                        />
                        <Text style={{ fontSize: 14, marginBottom: 8 }}>Disable alert popups for Auto Git actions</Text>
                    </View>
                    <View style={{ width: '48%' }}>
                        <TextInput
                            style={{ borderWidth: 1, borderColor: 'lightgray', borderRadius: 5, padding: 8 }}
                            value={workspaceUpdateInterval}
                            onChangeText={(text) => handleInputChange(text, setWorkspaceUpdateInterval)}
                            placeholder="Update Interval"
                            editable={workspaceRunStart}
                        />
                        <Text style={{ fontSize: 14, marginBottom: 8 }}>How frequently in seconds Auto Git will commit changes</Text>
                    </View>
                    <View style={{ width: '48%' }}>
                        <TextInput
                            style={{ borderWidth: 1, borderColor: 'lightgray', borderRadius: 5, padding: 8 }}
                            value={workspaceCommitMessage}
                            onChangeText={(text) => handleInputChange(text, setWorkspaceCommitMessage)}
                            placeholder="Commit Message"
                            editable={workspaceRunStart}
                        />
                        <Text style={{ fontSize: 14, marginBottom: 8 }}>Commit message that will be used by Auto Git</Text>
                    </View>
                    <View style={{ width: '48%' }}>
                        <TextInput
                            style={{ borderWidth: 1, borderColor: 'lightgray', borderRadius: 5, padding: 8 }}
                            value={workspaceLocale}
                            onChangeText={(text) => handleInputChange(text, setWorkspaceLocale)}
                            placeholder="Locale"
                            editable={workspaceRunStart}
                        />
                        <Text style={{ fontSize: 14, marginBottom: 8 }}>Locale to be used by Auto Git in commit messages</Text>
                    </View>
                    <View style={{ width: '48%' }}>
                        <TextInput
                            style={{ borderWidth: 1, borderColor: 'lightgray', borderRadius: 5, padding: 8 }}
                            value={workspaceTimeZone}
                            onChangeText={(text) => handleInputChange(text, setWorkspaceTimeZone)}
                            placeholder="Time Zone"
                            editable={workspaceRunStart}
                        />
                        <Text style={{ fontSize: 14, marginBottom: 8 }}>Timezone used for Auto Git's log file</Text>
                    </View>
                </View>
            </View>
            <Text style={{ fontSize: 20, marginBottom: 8, textAlign: 'center' }}>Editor</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Switch
                    value={holidayPref}
                    onValueChange={(value) => handleSwitchChange(value, setHolidayPref)}
                />
                <Text style={{ fontSize: 14 }}>Toggle holiday themes in the editor</Text>
            </View>
            <TouchableOpacity
                style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: 'black', borderRadius: 5, padding: 10, marginTop: 16 }}
                onPress={handleSubmit}
            >
                <Text style={{ textAlign: 'center' }}>Submit</Text>
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
                        <Text style={styles.tabText}>User</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTab("workspace settings")} style={tab === "workspace settings" ? styles.tabButtonClicked : styles.tabButton}>
                        <Text style={styles.tabText}>Workspace Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTab("membership")} style={tab === "membership" ? styles.tabButtonClicked : styles.tabButton}>
                        <Text style={styles.tabText}>Membership</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTab("exclusive content setup")} style={tab === "exclusive content setup" ? styles.tabButtonClicked : styles.tabButton}>
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
        width: '20%',
        backgroundColor: "#1c1c1a", // black background
        paddingVertical: 20,
    },
    tabButtonClicked: {
        padding: 10,
        borderRightWidth: 1,
        borderRightColor: "#00f",
        borderRadius: 5,
        marginBottom: 10,
    },
    tabButton: {
        padding: 10,
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
    textExclusive: {
        fontSize: 16,
        marginBottom: 10,
        color: "white"
    },
    contentContainer: {
        flex: 1,
        backgroundColor: "#1c1c1a", // black background
        paddingHorizontal: 20,
    },
    editUserButton: {
        borderRadius: 30,
        color: "green"
    },
    containerMembership: {
        marginTop: 20,
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
});

export default AccountSettings;

