import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import CompassIcon from '../icons/CompassIcon';
import AwesomeButton from "react-native-really-awesome-button";

const { width } = Dimensions.get('window');

const JourneyHomeHeader = ({ startedJourney }) => {
    const theme = useTheme();

    return (
        <View style={styles.outerContainer}>
            <Text style={[styles.header, {
                color: theme.colors.text,
                fontFamily: theme.fonts.h1.fontFamily,
                fontWeight: theme.fonts.h1.fontWeight,
                fontSize: 46,
            }]}>
                Embark on your Coding Journey
            </Text>
            <View style={styles.iconContainer}>
                <CompassIcon style={{ width: 200, height: 200 }} />
            </View>
            <AwesomeButton
                width={width * 0.8}
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
    outerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#dfce53',
        borderWidth: 0,
        width: '100%',
        marginHorizontal: 0,
        marginTop: 0,
    },
    header: {
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