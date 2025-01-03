import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";
import themeReducer from "./slices/themeslice";
import authReducer from "./slices/authslice";
import applicationReducer from "./reducers/applicaiton-config.reducer";

const rootReducers = combineReducers({
	theme: themeReducer,
	auth: authReducer,
	applicationConfig: applicationReducer,
});

export const store = configureStore({
	reducer: rootReducers,
	devTools: true,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export type RootState = ReturnType<typeof store.getState>;
