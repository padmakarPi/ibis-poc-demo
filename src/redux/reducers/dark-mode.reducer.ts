import { createSlice } from "@reduxjs/toolkit";

export const darkModeSlice = createSlice({
	name: "darkMode",
	initialState: {},
	reducers: {
		setDarkMode: (state, action) => ({
			...state,
			darkMode: action.payload,
		}),
	},
});

export const selectedDarkMode = (state: any) => state.darkMode;

export const { setDarkMode } = darkModeSlice.actions;

export default darkModeSlice.reducer;
