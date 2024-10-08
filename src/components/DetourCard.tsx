import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Card} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import CppLogo from '../img/Cpp_Logo.svg';
import GoLogo from '../img/Go-Logo-Blue.svg';
import CSharpLogo from '../img/Logo_C_sharp.svg';
import JavaScriptLogo from '../img/logo-javascript.svg';
import RustLogo from '../img/logo-rust.svg';
import PythonLogo from '../img/python-logo.svg';
import Config from 'react-native-config';

interface DetourCardProps {
  data: {
    id: string;
    name: string;
    image?: string;
    _id?: string;
    langs: string[];
  };
  onPress: () => void;
}

const DetourCard: React.FC<DetourCardProps> = ({data, onPress}) => {
  const theme = useTheme();

  // Function to get the correct image URL
  const getImageUrl = () => {
    if (data.image) {
      return data.image;
    } else if (data._id) {
      return `${Config.API_URL}/static/junit/t/${data._id}`;
    } else if (data.id) {
      return `${Config.API_URL}/static/junit/t/${data.id}`;
    }
    return 'https://via.placeholder.com/150';
  };

  // function to render the appropriate logo based on the language
  const renderLogo = (langs: string[]) => {
    if (!langs || langs.length === 0) return null;

    const lang = langs[0].toLowerCase();
    switch (lang) {
      case 'python':
      case 'py':
        return <PythonLogo width={30} height={30} style={styles.logo} />;
      case 'golang':
      case 'go':
        return <GoLogo width={30} height={30} style={styles.logo} />;
      case 'rust':
      case 'rs':
        return <RustLogo width={30} height={30} style={styles.logo} />;
      case 'cpp':
      case 'c++':
      case 'cc':
      case 'cxx':
        return <CppLogo width={30} height={30} style={styles.logo} />;
      case 'javascript':
      case 'js':
        return <JavaScriptLogo width={30} height={30} style={styles.logo} />;
      case 'c#':
      case 'csharp':
      case 'cs':
        return <CSharpLogo width={30} height={30} style={styles.logo} />;
      default:
        return <Text style={styles.logo}>{lang}</Text>;
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                {color: theme.colors.text, ...theme.fonts.medium},
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {data.name}
            </Text>
          </View>
          <FastImage
            source={{uri: getImageUrl()}}
            style={styles.image}
            onError={e =>
              console.log(
                'Image Load Error:',
                e.nativeEvent.error,
                'for URL:',
                getImageUrl(),
              )
            }
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.logoContainer}>{renderLogo(data.langs)}</View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    margin: 5,
    width: '100%',
  },
  content: {
    width: '100%',
    height: 200,
  },
  header: {
    height: '33%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
  },
  image: {
    height: '67%',
    width: '100%',
    resizeMode: 'cover',
  },
  logoContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 5,
  },
  logo: {
    width: 30,
    height: 30,
  },
});

export default DetourCard;
