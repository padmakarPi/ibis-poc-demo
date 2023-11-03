import { createSlice } from '@reduxjs/toolkit';
import { AuthState } from '@/interfaces/states/auth-state.interface';

// Initial state
const initialState: AuthState = {
  authState: {
    isAuthenticated: false,
    email: '',
    portals: '',
    userType: '',
    sid: '',
    access_token: '',
    name: '',
    expires_at: 0,
    profile: [],
  },
};

// Actual Slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set the authentication status
    setAuthState(state, action) {
      return { ...state, authState: action.payload };
    },
    resetAuthState(state) {
      return { ...state, authState: initialState.authState };
    },
  },
});

export const { setAuthState, resetAuthState } = authSlice.actions;

export const selectAuthState = (state: any) => state.auth.authState;
export const selectProfilesState = (state: any) => state.auth.authState.profile;

export default authSlice.reducer;
