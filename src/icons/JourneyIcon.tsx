import React from "react";
import { View, Image, StyleSheet } from 'react-native';
import compassImage from '../img/compass.svg';
import { SvgUri } from 'react-native-svg';

const JourneyIcon = ({ style }) => {
    return (
        <SvgUri
            uri="../img/compass.svg"
            style={style}
            width="200"
            height="200"
        />
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        height: 200,
        width: 200
    }
});

export default JourneyIcon;
