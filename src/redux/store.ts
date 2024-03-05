import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authslice";
import themeReducer from "./slices/themeslice";

const rootReducers = combineReducers({
	theme: themeReducer,
	auth: authReducer,
});

export const store = configureStore({
	reducer: rootReducers,
});
