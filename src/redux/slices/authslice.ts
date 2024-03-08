import { createSlice } from "@reduxjs/toolkit";

const initialState: Array<any> = [];
const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {},
	extraReducers: () => {},
});

export default authSlice.reducer;
