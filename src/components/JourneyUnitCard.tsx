import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {useTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import Config from 'react-native-config';
import CppLogo from '../img/Cpp_Logo.svg';
import GoLogo from '../img/Go-Logo-Blue.svg';
import CSharpLogo from '../img/Logo_C_sharp.svg';
import JavaScriptLogo from '../img/logo-javascript.svg';
import RustLogo from '../img/logo-rust.svg';
import PythonLogo from '../img/python-logo.svg';

interface JourneyUnitCardProps {
  data: {
    id: string;
    name: string;
    image?: string;
    _id?: string;
    langs: string[];
  };
  onPress: () => void;
  isSelected: boolean;
  currentUnit: string;
  unitNumber: number;
}

const JourneyUnitCard: React.FC<JourneyUnitCardProps> = ({
  data,
  onPress,
  isSelected,
  currentUnit,
  unitNumber,
}) => {
  const theme = useTheme();
  const scaleValue = React.useMemo(() => new Animated.Value(1), []);

  React.useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: isSelected ? 1.1 : 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [isSelected, scaleValue]);

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

  const renderLogo = (langs: string[]) => {
    if (!langs || langs.length === 0) return null;

    const lang = langs[0].toLowerCase();
    switch (lang) {
      case 'python':
      case 'py':
        return <PythonLogo width={20} height={20} style={styles.logo} />;
      case 'golang':
      case 'go':
        return <GoLogo width={20} height={20} style={styles.logo} />;
      case 'rust':
      case 'rs':
        return <RustLogo width={20} height={20} style={styles.logo} />;
      case 'cpp':
      case 'c++':
      case 'cc':
      case 'cxx':
        return <CppLogo width={20} height={20} style={styles.logo} />;
      case 'javascript':
      case 'js':
        return <JavaScriptLogo width={20} height={20} style={styles.logo} />;
      case 'c#':
      case 'csharp':
      case 'cs':
        return <CSharpLogo width={20} height={20} style={styles.logo} />;
      default:
        return <Text style={styles.logoText}>{lang}</Text>;
    }
  };

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        // eslint-disable-next-line react-native/no-inline-styles
        {
          transform: [{scale: scaleValue}],
          zIndex: isSelected ? 1 : 0,
        },
      ]}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.card,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            backgroundColor: isSelected
              ? theme.colors.primary
              : theme.colors.surface,
            borderColor:
              currentUnit === data._id ? theme.colors.accent : 'transparent',
          },
        ]}>
        <FastImage
          source={{uri: getImageUrl()}}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text
              style={[
                styles.title,
                {color: isSelected ? theme.colors.surface : theme.colors.text},
              ]}
              numberOfLines={2}>
              {data.name}
            </Text>
          </View>
          <View style={styles.logoContainer}>{renderLogo(data.langs)}</View>
        </View>
        <View style={styles.numberContainer}>
          <Text
            style={[styles.numberText, {color: theme.colors.text.secondary}]}>
            {unitNumber}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    padding: 6,
    borderRadius: 8,
    borderWidth: 2,
    height: 70,
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    width: 58,
    height: 58,
    borderRadius: 4,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 8,
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    paddingRight: 24, // Make space for the number
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    padding: 2,
  },
  logo: {
    width: 20,
    height: 20,
  },
  logoText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  numberContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default JourneyUnitCard;
