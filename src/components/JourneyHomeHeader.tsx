import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const JourneyHomeHeader = ({ startedJourney, completedJourneyTasks, completedJourneyUnits, detourCount, incompletedJourneyTasks }) => {
    if (startedJourney) {
        return (
            <View style={styles.container}>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{completedJourneyTasks}</Text>
                    <Text style={styles.statLabel}>Completed Stops</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{completedJourneyUnits}</Text>
                    <Text style={styles.statLabel}>Units Completed</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{detourCount}</Text>
                    <Text style={styles.statLabel}>Detours Taken</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{incompletedJourneyTasks}</Text>
                    <Text style={styles.statLabel}>Stops Remaining</Text>
                </View>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Continue Your Journey</Text>
                </TouchableOpacity>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Embark on your Coding Journey</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Start Your Journey</Text>
                </TouchableOpacity>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statBox: {
        margin: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dfce53',
        borderRadius: 30,
        borderColor: '#dfce53',
        borderWidth: 3,
    },
    statValue: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    statLabel: {
        color: '#fff',
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
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 12,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
    }
});

export default JourneyHomeHeader;
