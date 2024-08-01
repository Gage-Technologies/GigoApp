/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, Image, ScrollView} from 'react-native';
import {
  Modal,
  Portal,
  Text,
  Button,
  useTheme,
  IconButton,
  Card,
} from 'react-native-paper';
import Animated, {FadeInDown, FadeIn} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {RadialGradient, Defs, Rect, Stop} from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import the PNG image
import ProPopupIcon from '../img/pro-pop-up-icon-plain.png';

interface ProPopupProps {
  visible: boolean;
  onDismiss: () => void;
}

const {width, height} = Dimensions.get('window');

const ProPopup: React.FC<ProPopupProps> = ({visible, onDismiss}) => {
  const theme = useTheme();
  const [showLearnMore, setShowLearnMore] = useState(false);

  // reset showLearnMore when the popup is closed
  useEffect(() => {
    if (!visible) {
      setShowLearnMore(false);
    }
  }, [visible]);

  // function to handle pro upgrade
  const handleProUpgrade = () => {
    console.log('Upgrade to GIGO Pro');
    // implement pro upgrade logic here
  };

  // function to toggle learn more section
  const toggleLearnMore = () => {
    setShowLearnMore(!showLearnMore);
  };

  const renderMainContent = () => (
    <>
      <View style={styles.headerContainer}>
        <Animated.View
          entering={FadeIn.delay(300).duration(600)}
          style={styles.imageContainer}>
          <Image
            source={ProPopupIcon}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>
        <View style={styles.titleContainer}>
          <Animated.Text
            entering={FadeIn.delay(600).duration(600)}
            style={[styles.title, {color: theme.colors.primary}]}>
            GIGO Pro
          </Animated.Text>
          <Animated.Text
            entering={FadeIn.delay(900).duration(600)}
            style={[styles.subtitle, {color: theme.colors.onBackground}]}>
            Unlimited Learning, Unlimited Potential
          </Animated.Text>
        </View>
      </View>
      <Animated.View
        entering={FadeIn.delay(1200).duration(600)}
        style={styles.benefitContainer}>
        <Icon
          name="heart"
          size={40}
          color={theme.colors.error}
          style={styles.benefitIcon}
        />
        <Text style={[styles.benefitText, {color: theme.colors.onBackground}]}>
          Unlimited Hearts for Journeys and Bytes
        </Text>
      </Animated.View>
      <Animated.Text
        entering={FadeIn.delay(1500).duration(600)}
        style={[styles.description, {color: theme.colors.onBackground}]}>
        Never stop learning! With GIGO Pro, you'll have unlimited attempts on
        all Journeys and Bytes. Keep practicing, keep improving, and reach your
        coding goals without interruptions.
      </Animated.Text>
      <Animated.View
        entering={FadeIn.delay(1800).duration(600)}
        style={styles.infoContainer}>
        <Icon
          name="information"
          size={24}
          color="#4A90E2"
          style={styles.infoIcon}
        />
        <Text style={[styles.infoText, {color: theme.colors.onBackground}]}>
          Upgrade now and take your coding skills to the next level. More
          advanced features and other membership options are available on our
          web platform at gigo.dev
        </Text>
      </Animated.View>
      <Animated.View
        entering={FadeIn.delay(2100).duration(600)}
        style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleProUpgrade}
          style={styles.upgradeButton}
          contentStyle={styles.upgradeButtonContent}
          labelStyle={styles.upgradeButtonLabel}>
          Upgrade $3/month
        </Button>
        <Button
          mode="text"
          onPress={toggleLearnMore}
          style={styles.learnMoreButton}>
          Learn More About Pro
        </Button>
      </Animated.View>
    </>
  );

  const renderLearnMoreContent = () => (
    <ScrollView style={styles.learnMoreScrollView}>
      <Animated.Text
        entering={FadeIn.duration(600)}
        style={[styles.learnMoreTitle, {color: theme.colors.primary}]}>
        Pro Membership Options
      </Animated.Text>
      <Animated.Text
        entering={FadeIn.delay(300).duration(600)}
        style={[styles.learnMoreSubtitle, {color: theme.colors.onBackground}]}>
        Your membership provides pro access on both mobile and desktop
      </Animated.Text>

      {['Basic', 'Advanced', 'Max'].map((plan, index) => (
        <Animated.View
          key={plan}
          entering={FadeIn.delay(600 + index * 300).duration(600)}>
          <Card
            style={[styles.planCard, {backgroundColor: theme.colors.surface}]}
            onPress={() => handlePlanSelection(plan)}>
            <Card.Title
              title={plan}
              titleStyle={[styles.planTitle, {color: theme.colors.primary}]}
              left={props => (
                <Icon
                  name={
                    plan === 'Basic'
                      ? 'heart'
                      : plan === 'Advanced'
                      ? 'star-outline'
                      : 'star'
                  }
                  {...props}
                  color={theme.colors.primary}
                  size={24}
                />
              )}
            />
            {plan === 'Basic' && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Most Popular</Text>
              </View>
            )}
            <Card.Content>
              <Text style={[styles.planPrice, {color: theme.colors.onSurface}]}>
                ${plan === 'Basic' ? '3' : plan === 'Advanced' ? '8' : '15'}
                /month
              </Text>
              <View style={styles.planFeatureContainer}>
                <Icon
                  name="check-circle"
                  size={18}
                  color={theme.colors.primary}
                />
                <Text
                  style={[styles.planFeature, {color: theme.colors.onSurface}]}>
                  {plan === 'Basic'
                    ? 'Unlimited Retries'
                    : plan === 'Advanced'
                    ? 'Access to Challenges'
                    : 'Smarter Code Teacher'}
                </Text>
              </View>
              <View style={styles.planFeatureContainer}>
                <Icon
                  name="check-circle"
                  size={18}
                  color={theme.colors.primary}
                />
                <Text
                  style={[styles.planFeature, {color: theme.colors.onSurface}]}>
                  {plan === 'Basic'
                    ? 'Freeze Your Streak'
                    : plan === 'Advanced'
                    ? 'Larger DevSpaces'
                    : 'Everything in Advanced plan'}
                </Text>
              </View>
              {plan !== 'Basic' && (
                <Text
                  style={[styles.planNote, {color: theme.colors.onSurface}]}>
                  Available only through gigo.dev
                </Text>
              )}
            </Card.Content>
          </Card>
        </Animated.View>
      ))}

      <Animated.Text
        entering={FadeIn.delay(1800).duration(600)}
        style={[styles.additionalInfo, {color: theme.colors.onBackground}]}>
        Visit gigo.dev for more advanced features and detailed information about
        our membership options. Some features will only be available on desktop.
      </Animated.Text>

      <Button
        mode="contained"
        onPress={toggleLearnMore}
        style={styles.backButton}
        labelStyle={styles.backButtonLabel}>
        Back to Pro Upgrade
      </Button>
    </ScrollView>
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}>
        <LinearGradient
          colors={[
            theme.colors.background,
            theme.colors.background,
            theme.colors.primary + '45',
          ]}
          style={StyleSheet.absoluteFill}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          locations={[0, 0.5, 1]}
        />
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
                offset="70%"
                stopColor={theme.colors.primary}
                stopOpacity="0.1"
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
        <IconButton
          icon="close"
          size={24}
          onPress={onDismiss}
          style={styles.closeButton}
          color={theme.colors.onBackground}
        />
        <View style={styles.content}>
          <Animated.View
            entering={FadeInDown.duration(800).springify()}
            style={[styles.card, {backgroundColor: theme.colors.background}]}>
            {showLearnMore ? renderLearnMoreContent() : renderMainContent()}
          </Animated.View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    width: width * 0.95,
    maxHeight: height * 0.9,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  titleContainer: {
    flex: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'left',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'left',
    fontStyle: 'italic',
  },
  benefitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 16,
    width: '100%',
  },
  benefitIcon: {
    marginRight: 16,
  },
  benefitText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
    width: '100%',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 35,
    width: '100%',
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  upgradeButton: {
    marginBottom: 12,
    borderRadius: 5,
    elevation: 4,
    shadowColor: '#29C18C',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  upgradeButtonContent: {
    height: 56,
    width: 240,
  },
  upgradeButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  learnMoreButton: {
    marginTop: 8,
  },
  learnMoreScrollView: {
    width: '100%',
  },
  learnMoreTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  learnMoreSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  planCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 8,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  planFeatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planFeature: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  planNote: {
    fontSize: 14,
    marginBottom: 12,
  },
  additionalInfo: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 5,
  },
  backButtonLabel: {
    fontSize: 16,
  },
  popularBadge: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginBottom: 8,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ProPopup;
