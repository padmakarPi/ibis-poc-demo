import { documentConfigState } from "@/interfaces/states/theme.interfaces";
import { createSlice } from "@reduxjs/toolkit";

const initialState: documentConfigState = {
	documentConfig: {},
};

export const documentConfigSlice = createSlice({
	name: "documentConfig",
	initialState,
	reducers: {
		setDocumentConfig: (state, action) => ({
			...state,
			documentConfig: action.payload,
		}),
	},
});

export const selectDcoumentConfig = (state: any) => state.documentConfig;

export const { setDocumentConfig } = documentConfigSlice.actions;

export default documentConfigSlice.reducer;
