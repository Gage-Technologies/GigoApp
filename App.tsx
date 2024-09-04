/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as ReduxProvider} from 'react-redux';
import store from './src/reducers/store';
import {theme} from './src/theme';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AppRouter from './src/router';
import {requestUserPermission} from './src/pushNotifications/notificationPermissions.ts';
import {getFCMToken} from './src/pushNotifications/femToken.ts';
import {
  listenToBackgroundNotifications,
  listenToForegroundNotifications,
  onNotificationOpenedAppFromBackground,
  onNotificationOpenedAppFromQuit,
} from './src/pushNotifications/notificationHandlers.ts';
import {LanguageProvider} from './src/LanguageContext';
import InAppPurchases from './src/services/InAppPurchase';

const persistor = persistStore(store);

const App = () => {
  useEffect(() => {
    InAppPurchases.init();
    InAppPurchases.setupListeners();

    return () => {
      InAppPurchases.removeListeners();
    };
  }, []);

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <GestureHandlerRootView style={{flex: 1}}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PaperProvider theme={theme}>
            <LanguageProvider>
              <AppRouter />
            </LanguageProvider>
          </PaperProvider>
        </PersistGate>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
};

export default App;
