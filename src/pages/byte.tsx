/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {useSelector} from 'react-redux';
import {selectAuthState} from '../reducers/auth';
import {useNavigation} from '@react-navigation/native';
import XpPopup from '../components/XpPopup';
import ByteKeyboard from '../components/ByteKeyboard/ByteKeyboard';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {selectHapticStrength} from '../reducers/appSettings';

// component to display a byte or journey in a webview
const Byte: React.FC<{
  route: {params: {byteId: string; isJourney: boolean}};
}> = ({route}) => {
  let {byteId, isJourney} = route.params;

  const authState = useSelector(selectAuthState);
  const hapticStrength = useSelector(selectHapticStrength);
  const navigation = useNavigation();
  const [showXpPopup, setShowXpPopup] = useState(false);
  const [xpData, setXpData] = useState({
    oldXP: 0,
    newXP: 0,
    nextLevel: 1,
    maxXP: 100,
    levelUp: false,
    gainedXP: 0,
    renown: 0,
  });
  const webViewRef = useRef<WebView>(null);
  const [key, setKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [layerType, setLayerType] = useState<'hardware' | 'software'>('hardware'); // Track layer type

  // force re-render of webview on mount
  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, []);

  const getWebViewSource = useCallback(
    () => ({
      uri: `https://www.gigo.dev/byte/${byteId}?embed=true&viewport=mobile&appToken=${
        authState.token
      }${isJourney ? '&journey=true' : ''}`,
    }),
    [byteId, isJourney, authState.token],
  );

  // console.log('authState', authState);
  //
  // console.log(
  //   'target',
  //   `https://www.gigo.dev/byte/${byteId}?embed=true&viewport=mobile&appToken=${
  //     authState.token
  //   }${isJourney ? '&journey=true' : ''}`,
  // );

  const handleXpGain = (gainedXp: number) => {
    // TODO: Figure out how to handle all of this xp data
    const currentXP = 50;
    const currentLevel = 1;
    const xpForNextLevel = 100;

    const newXP = currentXP + gainedXp;
    const levelUp = newXP >= xpForNextLevel;
    const nextLevel = levelUp ? currentLevel + 1 : currentLevel;

    setXpData({
      oldXP: currentXP,
      newXP: newXP,
      nextLevel: nextLevel,
      maxXP: xpForNextLevel,
      levelUp: levelUp,
      gainedXP: gainedXp,
      renown: 0,
    });

    setShowXpPopup(true);
  };

  const handleCloseXpPopup = () => {
    setShowXpPopup(false);
  };

  // function to handle url changes
  const handleNavigationStateChange = (newNavState: any): boolean => {
    console.log('newNavState', newNavState);
    // parse the url manually since url.pathname is not implemented in hermes
    const urlParts = newNavState.url.split('/');
    const queryParts = urlParts[urlParts.length - 1].split('?');
    const pathParts = urlParts.slice(2, -1).concat(queryParts[0]);

    // check if the path is /journey
    if (pathParts[1] === 'journey') {
      // navigate to the journey page
      // @ts-ignore
      navigation.navigate('JourneyMain', {reload: true});
      // return false to prevent default navigation
      return false;
    }

    // update byteId if it has changed
    if (pathParts[2] && pathParts[2] !== byteId) {
      byteId = pathParts[2];
    }

    // update isJourney based on url parameters
    isJourney = newNavState.url.includes('journey=true');

    // Check for XP gain events here
    // This is a placeholder condition. Replace with actual logic to detect XP gain.
    if (newNavState.url.includes('xp_gained')) {
      const xpGained = 50; // Replace with actual XP gained
      handleXpGain(xpGained);
    }

    return true;
  };

  ////this function is used for tracking mouse movement and clicks on the page
  ///the webview glitches on the ide page when android layer is not hardware
  ///the handout and ct page glitches when android layer is hardware
  ///this tracks a specific pattern in the event handler that is only triggered when those are opened
  //this conditionally changes the layer type state variable in the webview to circumvent the issue above

  const injectPageTrackingScript = () => {
    if (!webViewRef.current) {
      console.error("WebView reference is null or undefined.");
      return;
    }

    webViewRef.current.injectJavaScript(`
    (function() {
      console.log("Tracking all events and mutations on the page");

      let mouseMoveCount = 0;
      let clickCount = 0;
      let isSoftwareMode = false; // Tracks current rendering mode

      // Function to log events and detect plugin interaction
      function logEvent(event) {
        if (event.type === 'mousemove') {
          mouseMoveCount++;
        } else if (event.type === 'click') {
          clickCount++;

          // Detect if a sidebar plugin is opened or clicked immediately
          const sidebarElement = document.querySelector('#editor-sidebar');
          if (sidebarElement && sidebarElement.contains(event.target)) {
            console.log('Sidebar interaction detected');
            if (!isSoftwareMode) {
              console.log('Switching to software rendering due to sidebar interaction');
              window.ReactNativeWebView.postMessage('switchToSoftware');
              isSoftwareMode = true;
            }
          }
        }

        console.log('Event detected:', event.type, event);
        window.ReactNativeWebView.postMessage('Event: ' + event.type + ' detected');

        if (mouseMoveCount >= 2 && clickCount >= 2) {
          if (isSoftwareMode) {
            console.log('Switching to hardware rendering');
            window.ReactNativeWebView.postMessage('switchToHardware');
          } else {
            console.log('Switching to software rendering');
            window.ReactNativeWebView.postMessage('switchToSoftware');
          }

          isSoftwareMode = !isSoftwareMode;  // Toggle mode
          mouseMoveCount = 0;
          clickCount = 0;
        }
      }

      // Add event listeners for different events
      document.addEventListener('click', logEvent);
      document.addEventListener('mousemove', logEvent);

      // MutationObserver to track all changes in the sidebar
      const sidebarContainer = document.querySelector('#editor-sidebar');
      if (sidebarContainer) {
        console.log('Started tracking mutations in the sidebar.');

        const observer = new MutationObserver(function(mutationsList) {
          mutationsList.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
              console.log('Sidebar mutation detected');
              if (!isSoftwareMode) {
                console.log('Switching to software rendering due to sidebar mutation');
                window.ReactNativeWebView.postMessage('switchToSoftware');
                isSoftwareMode = true;
              }
            }
          });
        });

        observer.observe(sidebarContainer, {
          attributes: true,  // Track attribute changes
          childList: true,   // Track additions or removals of child nodes
          subtree: true,     // Track changes within the entire subtree of the container
        });
      }
    })();
  `);
  };

  /**
   * handles key presses from the custom keyboard
   * injects appropriate key events into the webview to simulate typing
   * handles special keys like tab and arrow keys separately
   */
  function handleKeyPress(key: string) {
    // log the key pressed
    console.log('key pressed', key);

    // handle tab key
    if (key === 'Tab') {
      webViewRef.current?.injectJavaScript(`
        (function() {
          var event = new KeyboardEvent('keydown', {
            key: 'Tab',
            keyCode: 9,
            which: 9,
            bubbles: true
          });
          document.activeElement.dispatchEvent(event);
        })();
      `);
      return;
    }

    // handle arrow keys
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
      // inject a keydown event for the arrow key into the webview
      webViewRef.current?.injectJavaScript(`
        (function() {
          var event = new KeyboardEvent('keydown', {
            key: '${key}',
            keyCode: 0,
            which: 0,
            bubbles: true
          });
          document.activeElement.dispatchEvent(event);
        })();
      `);
      return;
    }

    // properly escape the key to handle special characters
    const escapedKey = JSON.stringify(key);

    // inject the key press into the webview
    webViewRef.current?.injectJavaScript(`
      (function() {
        var el = document.activeElement;
        var key = ${escapedKey};
        if (el && ('value' in el)) {
          // determine cursor positions
          var start = el.selectionStart;
          var end = el.selectionEnd;
          // insert the key at the cursor position
          el.value = el.value.slice(0, start) + key + el.value.slice(end);
          // update the cursor position
          el.selectionStart = el.selectionEnd = start + key.length;
          // dispatch input event to notify any listeners
          el.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          // for elements without value property, use execCommand as a fallback
          document.execCommand('insertText', false, key);
        }
      })();
    `);
  }

  /**
   * function to handle cursor movement from the joystick
   * injects appropriate key events into the webview to simulate cursor movement
   * and triggers haptic feedback
   * @param dx horizontal movement (-1 to 1)
   * @param dy vertical movement (-1 to 1)
   */
  const handleCursorMove = useCallback(
    (dx: number, dy: number) => {
      console.log('debounced cursor moved', dx, dy);
      // determine which arrow key to simulate based on the strongest direction
      let key = '';
      if (Math.abs(dx) > Math.abs(dy)) {
        key = dx > 0 ? 'ArrowRight' : 'ArrowLeft';
      } else {
        key = dy > 0 ? 'ArrowDown' : 'ArrowUp';
      }

      // only trigger movement if there's significant joystick displacement
      if (key) {
        webViewRef.current?.injectJavaScript(`
          (function() {
            var event = new KeyboardEvent('keydown', {
              key: '${key}',
              keyCode: 0,
              which: 0,
              bubbles: true
            });
            document.activeElement.dispatchEvent(event);
          })();
        `);

        // trigger haptic feedback
        ReactNativeHapticFeedback.trigger(hapticStrength, {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false,
        });
      }
    },
    [webViewRef],
  );

  // console.log("is loading rn: ", isLoading)

  useEffect(() => {
    console.log("in use effect")
  }, []);

  const forceReflow = () => {
    webViewRef.current?.injectJavaScript(`
    document.body.style.transform = 'translateZ(0)';
    setTimeout(() => { document.body.style.transform = ''; }, 100);
  `);
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <KeyboardAwareScrollView
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <View style={{flex: 1}}>
          {isLoading && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
          <WebView
            key={key}
            ref={webViewRef}
            source={getWebViewSource()}
            onNavigationStateChange={handleNavigationStateChange}
            onMessage={(event) => {
              const message = event.nativeEvent.data;

              if (message === 'switchToSoftware') {
                setLayerType('software');  // Switch to software rendering
              } else if (message === 'switchToHardware') {
                setLayerType('hardware');  // Switch back to hardware rendering
              }
            }}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => {
              setIsLoading(false);
              injectPageTrackingScript();  // Inject the script after the WebView has loaded
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            mixedContentMode="compatibility"
            androidLayerType={layerType}
            // onLoadEnd={() => {
            //   setIsLoading(false);
            //   forceReflow();  // Force a reflow after the page finishes loading
            // }}
            cacheEnabled={true}
          />
          {showXpPopup && (
            <XpPopup
              {...xpData}
              popupClose={handleCloseXpPopup}
              homePage={false}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
      <ByteKeyboard
        onKeyPress={handleKeyPress}
        onCursorMove={handleCursorMove}
      />
    </KeyboardAvoidingView>
  );
};

export default Byte;
