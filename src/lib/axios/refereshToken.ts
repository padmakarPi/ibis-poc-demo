// eslint-disable-next-line
/* eslint-disable consistent-return */
import { useContext } from "react";
import { AuthContext } from "@/authcontext/AuthContext";
import axios, { AxiosResponse, AxiosInstance } from "axios";
import { COMMON_METADATA } from "../constant/oidc";

const api: AxiosInstance = axios.create({});

const waitForTokenRefresh = (localStorageKey: string) => {
	while (localStorage.getItem(localStorageKey)) {
		new Promise(resolve => setTimeout(resolve, 1000));
	}
	return null;
};

export const getStoredTokenData = () => {
	const tokenData = JSON.parse(
		localStorage.getItem(COMMON_METADATA.OMNI_TOKEN_STORE_KEY) || "{}",
	);
	return tokenData;
};

const refreshToken = async () => {
	const { logout } = useContext(AuthContext);

	const tokenData = getStoredTokenData();
	const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || "";

	const requestBody: any = {
		grant_type: "refresh_token",
		client_id: clientId,
		refresh_token: tokenData?.refresh_token,
	};
	const requestBodyString = Object.keys(requestBody)
		.map(
			(key: any) =>
				`${encodeURIComponent(key)}=${encodeURIComponent(requestBody[key])}`,
		)
		.join("&");

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_STS_AUTHORITY}/connect/token`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: requestBodyString,
			},
		);

		if (!response.ok) {
			await logout();
		}
		const data = await response.json();
		return data.access_token;
	} catch (error) {
		console.error(error);
	}
};

export const refreshTokenInterceptor:
	| ((error: any) => any)
	| null
	| undefined = async error => {
	const originalRequest = error.config;

	if (
		(error.response?.status === 401 || error.response?.status === 403) &&
		!originalRequest.retry
	) {
		originalRequest.retry = true;

		const localStorageKey = COMMON_METADATA.OMNI_TOKEN_ALREADY_REQUESTED;

		if (localStorage.getItem(localStorageKey)) {
			await waitForTokenRefresh(localStorageKey);
			const tokenData = getStoredTokenData();
			originalRequest.headers.Authorization = `Bearer ${tokenData.access_token}`;
			return api(originalRequest);
		}

		localStorage.set(localStorageKey, true);
		const accessToken = await refreshToken();
		localStorage.set(localStorageKey, false);
		originalRequest.headers.Authorization = `Bearer ${accessToken}`;
		return api(originalRequest);
	}
	return Promise.reject(error);
};

export const successResponse = (response: AxiosResponse) => response;
