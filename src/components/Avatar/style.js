import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  githuFork: {
    width: Dimensions.get('window').width * 0.25, // Converted em to percentage of screen width
    height: Dimensions.get('window').width * 0.25, // Same as above
    position: 'absolute',
    overflow: 'hidden',
    top: 0,
    right: 0,
    zIndex: 9999,
    // Note: `pointer-events` is not supported in React Native styles
  },
  container: {
    position: 'relative',
    borderRadius: 8,
    width: 400, // Assuming this is the appropriate size, adjust if needed
    alignSelf: 'center',
    backgroundColor: '#f3f3f3',
    marginTop: 20,
    paddingVertical: 20,
  },
  pieces: {
    position: 'relative',
    overflow: 'hidden',
  },
  color: {
    height: 26,
    width: 23,
  },
  none: {
    opacity: 0.2,
    fontSize: 11,
    position: 'absolute',
    top: 20,
    left: 9,
  },
  styledAvatar: {
    width: 315,
    height: 235,
    paddingLeft: 20,
  },
  tab: {
    fontSize: 12,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 4,
    borderRadius: 4,
  },
  tabpane: {
    display: 'none', // Note: display property does not exist in React Native
    width: 400,
    padding: 10,
  },
  downloadRow: {
    textAlign: 'center',
  },
  tabs: {
    position: 'absolute',
    right: 50,
    top: 8,
    width: 100,
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  tabpanes: {
    width: 400,
  },
  button: {
    borderRadius: 7,
    backgroundColor: '#001f3f',
    paddingVertical: 5,
    paddingHorizontal: 7,
    fontSize: 20,
    letterSpacing: 0.6,
    marginHorizontal: 5,
  },
});

