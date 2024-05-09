import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import JourneyHomeHeader from '../components/JourneyHomeHeader';
import { useTheme } from 'react-native-paper';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const theme = useTheme();

    const [startedJourney, setStartedJourney] = useState(false);
    const [completedJourneyTasks, setCompletedJourneyTasks] = useState(5);
    const [completedJourneyUnits, setCompletedJourneyUnits] = useState(3);
    const [detourCount, setDetourCount] = useState(1);
    const [incompletedJourneyTasks, setIncompletedJourneyTasks] = useState(2);

    useEffect(() => {
        setTimeout(() => {
            setProjects([{ id: 1, title: "Project 1", description: "Description 1" }]);
            setLoading(false);
        }, 2000);
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{
                    alignItems: 'stretch',
                    paddingTop: 0
                }}
            >
                <JourneyHomeHeader
                    startedJourney={startedJourney}
                    completedJourneyTasks={completedJourneyTasks}
                    completedJourneyUnits={completedJourneyUnits}
                    detourCount={detourCount}
                    incompletedJourneyTasks={incompletedJourneyTasks}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'transparent',
        padding: 0,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        margin: 20,
    },
    card: {
        backgroundColor: '#282826',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Home;