"use client";

/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
import { useContext } from "react";
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { COMMON_METADATA } from "@/lib/constant/oidc";
import { AuthContext } from "@/authcontext/AuthContext";
import { jwtDecode } from "jwt-decode";
import { jwtDecodeData } from "@/interfaces/common/token-data.interface";
import { useSecureEnv } from "@/context/SecureEnvContext";

let refreshPromise: Promise<string> | null = null;

const useAxiosInterceptor = (baseURL: string | undefined) => {
	const axBackendInstance = axios.create({ baseURL });
	const { NEXT_PUBLIC_STS_AUTHORITY } = useSecureEnv();
	const { logout, login } = useContext(AuthContext);

	const getStoredTokenData = () => {
		if (typeof localStorage !== "undefined") {
			const tokenData = JSON.parse(
				localStorage.getItem(COMMON_METADATA.OMNI_TOKEN_STORE_KEY) || "{}",
			);
			return tokenData;
		}
		return {};
	};

	const getClientIdFromToken = () => {
		const tokenData = getStoredTokenData();
		const accessToken = tokenData?.access_token;
		if (!accessToken) return "";

		const decoded: jwtDecodeData = jwtDecode(accessToken);
		return decoded?.client_id;
	};

	const refreshToken = async () => {
		const tokenData = getStoredTokenData();

		const clientId = getClientIdFromToken() || "";

		const requestBody = new URLSearchParams();
		requestBody.append("grant_type", "refresh_token");
		requestBody.append("client_id", clientId);
		requestBody.append("refresh_token", tokenData?.refresh_token);

		try {
			const response = await fetch(
				`${NEXT_PUBLIC_STS_AUTHORITY}connect/token`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: requestBody,
				},
			);

			if (!response.ok) {
				await logout();
			}
			const data = await response.json();
			localStorage.setItem(
				COMMON_METADATA.OMNI_TOKEN_STORE_KEY,
				JSON.stringify({ ...data }),
			);
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
			if (refreshPromise) {
				const token = await refreshPromise;

				originalRequest.headers.Authorization = `Bearer ${token}`;
				return axBackendInstance(originalRequest);
			}

			refreshPromise = (async () => {
				try {
					return await refreshToken();
				} finally {
					refreshPromise = null;
				}
			})();

			const accessToken = await refreshPromise;

			originalRequest.headers.Authorization = `Bearer ${accessToken}`;
			return axBackendInstance(originalRequest);
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

		await login();

		return newConfig;
	};

	axBackendInstance.interceptors.request.use(authRequest);
	axBackendInstance.interceptors.response.use(
		successResponse,
		refreshTokenInterceptor,
	);

	return { axBe: axBackendInstance };
};

export default useAxiosInterceptor;
