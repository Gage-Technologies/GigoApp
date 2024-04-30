import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import CompassIcon from '../icons/CompassIcon';
import AwesomeButton from "react-native-really-awesome-button";


const JourneyHomeHeader = ({ startedJourney }) => {
    const theme = useTheme();

    return (
        <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
            <Text style={[styles.header, {color: theme.colors.text}]}>
                Embark on your Coding Journey
            </Text>
            <View style={styles.iconContainer}>
                <CompassIcon style={{ width: 200, height: 200 }} />
            </View>
            <AwesomeButton
                stretch
                height={80}
                backgroundColor={theme.colors.primary}
                backgroundDarker={theme.colors.primaryDark}
                textColor={theme.colors.onPrimary}
                borderRadius={12}
                onPress={() => console.log("Navigate to main journey")}
            >
                Start Your Journey
            </AwesomeButton>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    }
});

export default JourneyHomeHeader;
