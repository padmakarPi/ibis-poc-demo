import Axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

import { useContext } from "react";
import { AuthContext } from "@/authcontext/AuthContext";
import {
	getStoredTokenData,
	refreshTokenInterceptor,
	successResponse,
} from "./refereshToken";

export const authRequest = async (config: InternalAxiosRequestConfig) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const { login } = useContext(AuthContext);
	const newConfig = config;

	const tokenData = getStoredTokenData();
	if (tokenData && tokenData.access_token) {
		newConfig.headers!.Authorization = `Bearer ${tokenData.access_token}`;
		newConfig.headers!.Accept = "application/json";
		return newConfig;
	}
	await login();

	return newConfig;
};

export const createAxiosInstance = (
	baseURL: string | undefined,
): AxiosInstance => {
	const axiosInstance: AxiosInstance = Axios.create({
		baseURL,
	});

	axiosInstance.interceptors.request.use(authRequest);
	axiosInstance.interceptors.response.use(
		successResponse,
		refreshTokenInterceptor,
		{ synchronous: true },
	);

	return axiosInstance;
};
