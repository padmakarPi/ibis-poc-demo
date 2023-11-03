import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	persistStore,
	persistReducer,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { authSlice } from "./reducers/auth.reducer";

const persistConfig = {
	key: "root",
	whitelist: ["auth"],
	storage,
};

const rootReducer = combineReducers({
	[authSlice.name]: authSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	devTools: true,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const persistor = persistStore(store);
