import {configureStore} from '@reduxjs/toolkit';
import authReducer from './auth.ts';
import heartsReducer from './hearts.ts';
import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // Optionally, you can whitelist specific reducers to persist
  // whitelist: ['auth', 'cart']
};

const reducers = combineReducers({
  auth: authReducer,
  hearts: heartsReducer,
});

export const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
