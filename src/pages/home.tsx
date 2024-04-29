import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const Home = () => {
    // Simulation of some states and data
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);

    // Simulate fetching data
    useEffect(() => {
        setTimeout(() => {
            setProjects([{ id: 1, title: "Project 1", description: "Description 1" }]);
            setLoading(false);
        }, 2000);
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Welcome to GigoApp!</Text>
            <Button title="Click Me" onPress={() => Alert.alert('Button Clicked!')} />
            {
                loading ?
                <Text>Loading projects...</Text> :
                projects.map(project => (
                    <View key={project.id} style={styles.card}>
                        <Text style={styles.cardTitle}>{project.title}</Text>
                        <Text>{project.description}</Text>
                    </View>
                ))
            }
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
