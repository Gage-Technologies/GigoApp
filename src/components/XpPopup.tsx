import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import HapticTouchableOpacity from './Buttons/HapticTouchableOpacity';
import {useTheme, Button, IconButton} from 'react-native-paper';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {selectAuthState} from '../reducers/auth';
import Svg, {RadialGradient, Defs, Rect, Stop} from 'react-native-svg';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface XpPopupProps {
  oldXP: number;
  newXP: number;
  nextLevel: number;
  maxXP: number;
  levelUp: boolean;
  gainedXP: number;
  renown: number;
  popupClose: () => void;
  homePage: boolean;
}

const XpPopup: React.FC<XpPopupProps> = props => {
  const theme = useTheme();
  const authState = useSelector(selectAuthState);

  const [startXP, setStartXP] = useState(props.oldXP);
  const [extraXP, setExtraXP] = useState(props.newXP - props.oldXP);
  const [currentLevel, setCurrentLevel] = useState(props.nextLevel - 1);
  const [nextLevel, setNextLevel] = useState(props.nextLevel);
  const [xpTitle, setXpTitle] = useState(props.gainedXP);
  const [renown, setRenown] = useState(props.renown);
  const [showPro, setShowPro] = useState(false);
  const [proMonthlyLink, setProMonthlyLink] = useState('');
  const [proYearlyLink, setProYearlyLink] = useState('');
  const [proUrlsLoading, setProUrlsLoading] = useState(false);

  const [slideAnim] = useState(
    new Animated.Value(Dimensions.get('window').height),
  );

  useEffect(() => {
    let premium = authState.role.toString();
    if (authState.authenticated && premium === '0') {
      retrieveProUrls();
    }

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const retrieveProUrls = async () => {
    setProUrlsLoading(true);
    try {
      const response = await fetch(
        `${Config.API_URL}/api/stripe/premiumMembershipSession`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        },
      );
      const res = await response.json();
      setProUrlsLoading(false);

      if (res && res['return url'] && res['return year']) {
        setProMonthlyLink(res['return url']);
        setProYearlyLink(res['return year']);
        return {
          monthly: res['return url'],
          yearly: res['return year'],
        };
      }
    } catch (error) {
      console.error('Error retrieving pro URLs:', error);
      setProUrlsLoading(false);
    }
    return null;
  };

  const confirmButton = useCallback(async () => {
    if (props.popupClose) {
      props.popupClose();
    }
    await AsyncStorage.setItem('loginXP', 'undefined');
  }, [props.popupClose]);

  const renderXPPopup = () => {
    if (showPro) {
      return (
        <View style={styles.proContainer}>
          <IconButton
            icon="close"
            size={24}
            onPress={() => {
              if (props.popupClose) {
                props.popupClose();
              }
            }}
            style={styles.closeButton}
          />
          <Text style={styles.proTitle}>GIGO Pro</Text>
          <Text style={styles.proDescription}>
            Learn faster with a smarter Code Teacher!
          </Text>
          <Text style={styles.proDescription}>
            Do more with larger DevSpaces!
          </Text>
          <View style={styles.proOptionsContainer}>
            <View style={styles.proOption}>
              <Text style={styles.proOptionTitle}>Monthly</Text>
              <Text style={styles.proOptionPrice}>$8</Text>
              <Button
                mode="contained"
                loading={proUrlsLoading}
                onPress={() => {
                  /* Handle monthly subscription */
                }}
                style={styles.proButton}>
                Select
              </Button>
            </View>
            <View style={styles.proOption}>
              <Text style={styles.proOptionTitle}>Yearly</Text>
              <Text style={styles.proOptionPrice}>$80</Text>
              <Button
                mode="contained"
                loading={proUrlsLoading}
                onPress={() => {
                  /* Handle yearly subscription */
                }}
                style={styles.proButton}>
                Select
              </Button>
            </View>
          </View>
          <HapticTouchableOpacity
            onPress={() => {
              /* Navigate to premium info page */
            }}>
            <Text style={styles.learnMoreText}>Learn More About Pro</Text>
          </HapticTouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.xpContainer}>
          <Svg style={StyleSheet.absoluteFill}>
            <Defs>
              <RadialGradient
                id="grad"
                cx="50%"
                cy="50%"
                rx="50%"
                ry="50%"
                gradientUnits="userSpaceOnUse">
                <Stop
                  offset="0%"
                  stopColor={theme.colors.primary}
                  stopOpacity="0.4"
                />
                <Stop
                  offset="40%"
                  stopColor={theme.colors.primary}
                  stopOpacity="0.1"
                />
                <Stop
                  offset="70%"
                  stopColor={theme.colors.primary}
                  stopOpacity="0.05"
                />
                <Stop
                  offset="100%"
                  stopColor={theme.colors.background}
                  stopOpacity="0"
                />
              </RadialGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
          </Svg>
          <Text
            style={[
              styles.xpTitle,
              {color: theme.colors.text},
            ]}>{`You Gained ${xpTitle} XP`}</Text>
          <View style={styles.progressContainer}>
            <Text
              style={[
                styles.levelText,
                {color: theme.colors.text},
              ]}>{`Level ${currentLevel}`}</Text>
            <View
              style={[
                styles.progressBar,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.primary,
                },
              ]}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: `${((startXP + extraXP) / props.maxXP) * 100}%`,
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              />
            </View>
            <Text
              style={[
                styles.levelText,
                {color: theme.colors.text},
              ]}>{`Level ${nextLevel}`}</Text>
          </View>
          <Button
            mode="outlined"
            onPress={confirmButton}
            style={[styles.confirmButton, {borderColor: theme.colors.primary}]}
            labelStyle={[
              styles.confirmButtonLabel,
              {color: theme.colors.primary},
            ]}>
            Confirm
          </Button>
        </View>
      );
    }
  };

  return (
    <Animated.View
      style={[
        styles.popupContainer,
        {
          backgroundColor: theme.colors.background,
          transform: [{translateY: slideAnim}],
          borderTopColor: theme.colors.primary,
        },
      ]}>
      {renderXPPopup()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    elevation: 5,
    borderTopWidth: 2,
  },
  xpContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  xpTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  renownText: {
    fontSize: 18,
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    zIndex: 1,
  },
  levelText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  progressBar: {
    flex: 1,
    height: 20,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 2,
  },
  progressFill: {
    height: '100%',
  },
  confirmButton: {
    marginTop: 20,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 2,
  },
  confirmButtonLabel: {
    fontSize: 16,
  },
  proContainer: {
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  proTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  proDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  proOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  proOption: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    width: '45%',
  },
  proOptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  proOptionPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  proButton: {
    marginTop: 10,
  },
  learnMoreText: {
    marginTop: 20,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default XpPopup;
