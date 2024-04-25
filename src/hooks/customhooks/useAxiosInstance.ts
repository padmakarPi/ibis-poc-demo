/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
import React, { useContext } from "react";
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { COMMON_METADATA } from "@/lib/constant/oidc";
import { AuthContext } from "@/authcontext/AuthContext";

const useAxiosInterceptor = (baseURL: string | undefined) => {
	const axBackendInstance = axios.create({ baseURL });

	const { logout } = useContext(AuthContext);

	const getStoredTokenData = () => {
		if (typeof localStorage !== "undefined") {
			const tokenData = JSON.parse(
				localStorage.getItem(COMMON_METADATA.OMNI_TOKEN_STORE_KEY) || "{}",
			);
			return tokenData;
		}
		return {};
	};

	const waitForTokenRefresh = async (localStorageKey: string) => {
		while (localStorage.getItem(localStorageKey)) {
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
	};
	const refreshToken = async () => {
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

	const refreshTokenInterceptor = async (error: any) => {
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
				return axBackendInstance(originalRequest);
			}

			localStorage.setItem(localStorageKey, "true");
			try {
				const accessToken = await refreshToken();
				localStorage.removeItem(localStorageKey);
				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				return axBackendInstance(originalRequest);
			} catch (err) {
				localStorage.removeItem(localStorageKey);
				throw err;
			}
		}
		return Promise.reject(error);
	};

	const successResponse = (response: AxiosResponse) => response;
	const authRequest = async (config: InternalAxiosRequestConfig) => {
		const newConfig = config;

		const tokenData = getStoredTokenData();
		if (tokenData && tokenData.access_token) {
			newConfig.headers!.Authorization = `Bearer ${tokenData.access_token}`;
			newConfig.headers!.Accept = "application/json";
			return newConfig;
		}

		return newConfig;
	};

	React.useEffect(() => {
		if (!baseURL) return;

		const reqInterceptor =
			axBackendInstance.interceptors.request.use(authRequest);
		const resInterceptor = axBackendInstance.interceptors.response.use(
			successResponse,
			refreshTokenInterceptor,
		);

		return () => {
			axBackendInstance.interceptors.request.eject(reqInterceptor);

			axBackendInstance.interceptors.response.eject(resInterceptor);
		};
	}, [baseURL]);

	return { axBe: axBackendInstance };
};

export default useAxiosInterceptor;
