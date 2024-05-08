// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface TutorialState {
  all: boolean | null;
  home: boolean | null;
  challenge: boolean | null;
  workspace: boolean | null;
  nemesis: boolean | null;
  stats: boolean | null;
  create_project: boolean | null;
  launchpad: boolean | null;
  vscode: boolean | null;
  bytes: boolean | null;
}

interface AuthState {
  authenticated: boolean | null;
  token: string | null;
  id: string | null;
  userName: string | null;
  email: string | null;
  phone: string | null;
  role: number | null;
  tier: number | null;
  rank: number | null;
  coffee: number | null;
  expiration: number | null;
  thumbnail: string | null;
  backgroundColor: string | null;
  backgroundRenderInFront: boolean | null;
  backgroundName: string | null;
  exclusiveContent: boolean | null;
  exclusiveAgreement: boolean | null;
  tutorialState: TutorialState;
  inTrial: boolean | null;
  hasPaymentInfo: boolean | null;
  hasSubscription: boolean | null;
  alreadyCancelled: boolean | null;
  lastRefresh: number | null;
  usedFreeTrial: boolean | null;
}

// Define AuthStateUpdate to allow partial updates with nullable fields
type AuthStateUpdate = {
  [K in keyof AuthState]?: AuthState[K];
}

const initialState: AuthState = {
  authenticated: false,
  token: '',
  id: '',
  userName: '',
  email: '',
  phone: '',
  role: 0,
  tier: 0,
  rank: 0,
  coffee: 0,
  expiration: 0,
  thumbnail: '',
  backgroundColor: '',
  backgroundRenderInFront: false,
  backgroundName: '',
  exclusiveContent: false,
  exclusiveAgreement: false,
  tutorialState: {
    all: false,
    home: false,
    challenge: false,
    workspace: false,
    nemesis: false,
    stats: false,
    create_project: false,
    launchpad: false,
    vscode: false,
    bytes: false,
  },
  inTrial: false,
  hasPaymentInfo: false,
  hasSubscription: false,
  alreadyCancelled: false,
  lastRefresh: null,
  usedFreeTrial: false,
};

export const initialAuthStateUpdate: AuthStateUpdate = {
  authenticated: null,
  token: null,
  id: null,
  role: null,
  userName: null,
  email: null,
  phone: null,
  tier: null,
  rank: null,
  coffee: null,
  expiration: null,
  thumbnail: null,
  backgroundColor: null,
  backgroundRenderInFront: null,
  backgroundName: null,
  exclusiveContent: null,
  exclusiveAgreement: null,
  tutorialState: {
    all: null,
    home: null,
    challenge: null,
    workspace: null,
    nemesis: null,
    stats: null,
    create_project: null,
    launchpad: null,
    vscode: null,
    bytes: null,
  },
  inTrial: null,
  hasPaymentInfo: null,
  hasSubscription: null,
  alreadyCancelled: null,
  lastRefresh: null,
  usedFreeTrial: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
    reducers: {
      logout: (state) => {
        Object.assign(state, initialAuthStateUpdate);
      },
      updateAuthState: (state, action: PayloadAction<AuthStateUpdate>) => {
        return { ...state, ...action.payload };
      },
    },
});

export const { updateAuthState } = authSlice.actions;

export const selectAuthState = (state: RootState) => state.auth;

export default authSlice.reducer;
