import React, {useState, useEffect} from 'react';
import {Animated, Image, Text, View, StyleSheet} from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { useSelector } from 'react-redux';
import { selectAuthState } from '../reducers/auth';

// define the props type for the component
type SplashScreenProps = {
  onAnimationEnd: () => void;
};

// define the animated boot splash component
const SplashScreen: React.FC<SplashScreenProps> = ({onAnimationEnd}) => {
  // get the auth state
  const authState = useSelector(selectAuthState);

  // initialize the opacity state with an animated value
  const [opacity] = useState(() => new Animated.Value(1));
  const [textOpacity] = useState(() => new Animated.Value(0));
  const [textTranslateY] = useState(() => new Animated.Value(50));

  // use the hide animation hook from bootsplash
  const {container, logo} = BootSplash.useHideAnimation({
    manifest: require('../assets/bootsplash/manifest.json'),
    logo: require('../assets/bootsplash/logo.png'),
    statusBarTranslucent: true,
    navigationBarTranslucent: false,
    animate: () => {
      // perform fade out animation for the logo
      Animated.timing(opacity, {
        useNativeDriver: true,
        toValue: 0,
        duration: 500,
      }).start();

      // perform fade in and slide up animation for the text
      Animated.parallel([
        Animated.timing(textOpacity, {
          useNativeDriver: true,
          toValue: 1,
          duration: 500,
          delay: 250,
        }),
        Animated.timing(textTranslateY, {
          useNativeDriver: true,
          toValue: 0,
          duration: 500,
          delay: 250,
        }),
      ]).start(() => {
        // delay before calling onAnimationEnd
        setTimeout(onAnimationEnd, 2000);
      });
    },
  });

  // render the animated view with the logo and text
  return (
    <View style={styles.container}>
      <Animated.View {...container} style={[container.style, {opacity}]}>
        <Image {...logo} />
      </Animated.View>
      <Animated.View style={[styles.textContainer, {opacity: textOpacity, transform: [{translateY: textTranslateY}]}]}>
        <Text style={styles.title}>
          {authState.authenticated ? `Hello ${authState.userName}!` : 'Welcome to GIGO!'}
        </Text>
        <Text style={styles.subtitle}>
          {authState.authenticated ? "Let's learn to code today!" : 'Start your coding journey'}
        </Text>
      </Animated.View>
    </View>
  );
};

// styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1a',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#cccccc',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#999999',
  },
});

export default SplashScreen;
