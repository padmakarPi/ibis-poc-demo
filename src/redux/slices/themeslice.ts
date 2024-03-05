import { IThemeState } from "@/interfaces/states/theme.interfaces";
import { createSlice } from "@reduxjs/toolkit";

const initialState: IThemeState = {
	isDarkMode: false,
};

const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		toogleTheme: state => ({
			...state,
			isDarkMode: !state.isDarkMode,
		}),
	},
});

export const { toogleTheme } = themeSlice.actions;

export const selectTheme = (state: { theme: IThemeState }) =>
	state.theme.isDarkMode;
export default themeSlice.reducer;
