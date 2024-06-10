import { combineReducers, configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeslice";
import authReducer from "./slices/authslice";

const rootReducers = combineReducers({
	theme: themeReducer,
	auth: authReducer,
});

export const store = configureStore({
	reducer: rootReducers,
});
