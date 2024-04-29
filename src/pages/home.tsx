import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import JourneyHomeHeader from '../components/JourneyHomeHeader';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);

    // Simulated journey state data
    const [startedJourney, setStartedJourney] = useState(false);
    const [completedJourneyTasks, setCompletedJourneyTasks] = useState(5);
    const [completedJourneyUnits, setCompletedJourneyUnits] = useState(3);
    const [detourCount, setDetourCount] = useState(1);
    const [incompletedJourneyTasks, setIncompletedJourneyTasks] = useState(2);

    // Simulate fetching project data
    useEffect(() => {
        setTimeout(() => {
            setProjects([{ id: 1, title: "Project 1", description: "Description 1" }]);
            setLoading(false);
        }, 2000);
    }, []);

    return (
        <ScrollView style={styles.container}>
            <JourneyHomeHeader
                startedJourney={startedJourney}
                completedJourneyTasks={completedJourneyTasks}
                completedJourneyUnits={completedJourneyUnits}
                detourCount={detourCount}
                incompletedJourneyTasks={incompletedJourneyTasks}
            />
            <Text style={styles.header}>Welcome to GigoApp!</Text>
            <Button title="Click Me" onPress={() => Alert.alert('Button Clicked!')} />
            {loading ? (
                <Text>Loading projects...</Text>
            ) : (
                projects.map(project => (
                    <View key={project.id} style={styles.card}>
                        <Text style={styles.cardTitle}>{project.title}</Text>
                        <Text>{project.description}</Text>
                    </View>
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Home;
