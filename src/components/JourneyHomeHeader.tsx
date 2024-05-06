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
                color: `black`,
                fontFamily: theme.fonts.medium.fontFamily,
                fontWeight: '500',
                fontSize: 44,
                textShadowColor: 'rgba(0, 0, 0, 0.75)', // Adding shadow
                textShadowOffset: { width: -1, height: 1 },
                textShadowRadius: 2
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
                backgroundDarker={theme.colors.primaryVariant}
                textColor={theme.colors.onPrimary}
                borderRadius={12}
                onPress={() => console.log("Navigate to main journey")}
                textSize={28}
                textFontFamily={theme.fonts.medium.fontFamily}
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
        paddingBottom: 50,
        backgroundColor: '#dfce53',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        width: '100%',
        marginHorizontal: 0,
        marginTop: 0,
    },
    header: {
        textAlign: 'center',
        marginBottom: 40,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 45,
    }
});

export default JourneyHomeHeader;
