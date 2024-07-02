import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Card} from 'react-native-paper';
import {useTheme} from 'react-native-paper';

interface DetourCardProps {
  data: {
    id: string;
    title: string;
    image: string;
    language: string;
  };
}

const languageLogos = {
  'C++': require('../img/Cpp_Logo.svg'),
  Go: require('../img/Go-Logo-Blue.svg'),
  'C#': require('../img/Logo_C_sharp.svg'),
  JavaScript: require('../img/logo-javascript.svg'),
  Rust: require('../img/logo-rust.svg'),
  Python: require('../img/python-logo.svg'),
};

const DetourCard: React.FC<DetourCardProps> = ({data}) => {
  const theme = useTheme();

  return (
    <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
      <View style={styles.content}>
        <View style={styles.info}>
          <Text
            style={[
              styles.title,
              {color: theme.colors.text, ...theme.fonts.medium},
            ]}>
            {data.title}
          </Text>
          <Image
            source={languageLogos[data.language]}
            style={styles.languageLogo}
          />
        </View>
        <Image source={{uri: data.image}} style={styles.image} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    margin: 5,
  },
  content: {
    flexDirection: 'row',
    width: '100%',
    height: 100,
  },
  info: {
    width: '40%',
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
  },
  languageLogo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  image: {
    width: '60%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default DetourCard;
