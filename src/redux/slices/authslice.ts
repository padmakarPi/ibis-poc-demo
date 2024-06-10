import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "@/interfaces/states/auth-state.interface";

const initialState: AuthState = {
	authState: {
		email: "",
		portals: [],
		userType: "",
		sid: "",
		name: "",
		expires_at: 0,
	},
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
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
