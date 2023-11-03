import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./auth.reducer";

const rootReducer = combineReducers({
	user: userReducer,
});

export default rootReducer;
