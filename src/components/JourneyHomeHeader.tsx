import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import JourneyIcon from '../icons/JourneyIcon';

const JourneyHomeHeader = ({ startedJourney, completedJourneyTasks, completedJourneyUnits, detourCount, incompletedJourneyTasks }) => {
    const theme = useTheme(); // This assumes you have theme setup

    return (
        <View style={[styles.container, {padding: 16}]}>
            {startedJourney ? (
                <>
                    <View style={[styles.statBox, {backgroundColor: theme.colors.primary}]}>
                        <Text style={[styles.statValue, {color: theme.colors.onPrimary}]}>{completedJourneyTasks}</Text>
                        <Text style={[styles.statLabel, {color: theme.colors.onPrimary}]}>Completed Stops</Text>
                    </View>
                    <TouchableOpacity style={[styles.button, {backgroundColor: theme.colors.buttonColor}]}>
                        <Text style={[styles.buttonText, {color: theme.colors.onButton}]}>Continue Your Journey</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text style={[styles.header, {color: theme.colors.text}]}>
                        Embark on your Coding Journey
                    </Text>
                    <View style={{ alignItems: 'center', marginVertical: 16 }}>
                        <JourneyIcon style={{ width: 200, height: 200 }} />
                    </View>
                    <TouchableOpacity style={[styles.button, {backgroundColor: theme.colors.buttonColor}]}>
                        <Text style={[styles.buttonText, {color: theme.colors.onButton}]}>Start Your Journey</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    statBox: {
        margin: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        borderWidth: 3,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 18,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
        padding: 10,
        borderRadius: 12,
        width: '80%' // Adjust width as needed
    },
    buttonText: {
        fontSize: 18,
        textAlign: 'center'
    }
});

export default JourneyHomeHeader;
