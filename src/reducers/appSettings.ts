// src/reducers/appSettings.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
// @ts-ignore
import {RootState} from '../../app/store';

// define the haptic strength options
export enum HapticStrength {
  Light = 'impactLight',
  Medium = 'impactMedium',
  Heavy = 'impactHeavy',
}

// define the app settings state interface
interface AppSettingsState {
  hapticStrength: HapticStrength;
}

// define the initial state
const initialState: AppSettingsState = {
  hapticStrength: HapticStrength.Medium,
};

// create the app settings slice
export const appSettingsSlice = createSlice({
  name: 'appSettings',
  initialState,
  reducers: {
    // reducer to update haptic strength
    setHapticStrength: (state, action: PayloadAction<HapticStrength>) => {
      state.hapticStrength = action.payload;
    },
  },
});

// export actions
export const {setHapticStrength} = appSettingsSlice.actions;

// selector to get the current haptic strength
export const selectHapticStrength = (state: RootState): HapticStrength =>
  state.appSettings.hapticStrength;

// export the reducer
export default appSettingsSlice.reducer;
