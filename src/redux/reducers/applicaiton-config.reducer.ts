import { createSlice } from "@reduxjs/toolkit";

const isBrowser = typeof window !== "undefined";

export const applicationConfig = createSlice({
	name: "applicationConfig",
	initialState: {
		openPanel: isBrowser
			? parseInt(localStorage.getItem("selectedPanel") || "1", 10)
			: 1,
	},
	reducers: {
		setOpenPanel: (state, action) => {
			state.openPanel = action.payload;
			if (isBrowser) {
				localStorage.setItem("selectedPanel", action.payload);
			}
		},
	},
});

export const selectedApplicationConfig = (state: any) =>
	state.applicationConfig;

export const selectedOpenPanel = (state: any) =>
	state.applicationConfig.openPanel;

export const { setOpenPanel } = applicationConfig.actions;

export default applicationConfig.reducer;
