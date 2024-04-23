import { combineReducers, configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeslice";

const rootReducers = combineReducers({
	theme: themeReducer,
});

export const store = configureStore({
	reducer: rootReducers,
});
