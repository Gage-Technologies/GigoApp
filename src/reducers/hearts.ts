import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './store';
import {DailyHearts} from '../models/dailyHearts';

export interface HeartsState {
  remainingHearts: number;
}

export interface HeartsStateUpdate {
  remainingHearts: number | null;
}

export const initialHeartsState: HeartsState = {
  remainingHearts: DailyHearts,
};

export const initialHeartsStateUpdate: HeartsStateUpdate = {
  remainingHearts: null,
};

export const heartsSlice = createSlice({
  name: 'hearts',
  initialState: initialHeartsState,
  reducers: {
    clearHeartsState: state => {
      state.remainingHearts = DailyHearts;
    },
    updateHeartsState: (state, action: PayloadAction<HeartsStateUpdate>) => {
      if (action.payload.remainingHearts !== null) {
        state.remainingHearts = action.payload.remainingHearts;
      }
    },
    decrementHeartsState: state => {
      state.remainingHearts = state.remainingHearts - 1;
    },
  },
});

export const {updateHeartsState, clearHeartsState, decrementHeartsState} =
  heartsSlice.actions;

export const selectHeartsState = (state: RootState) => state.hearts;
export const selectRemainingHearts = (state: RootState) =>
  state.hearts?.remainingHearts;
export const selectOutOfHearts = (state: RootState) =>
  state.hearts?.remainingHearts === 0;

export default heartsSlice.reducer;