/* eslint-disable no-await-in-loop */
/* eslint-disable no-constant-condition */

import axios, { AxiosResponse, AxiosInstance } from "axios";
import AuthService from "@/services/auth.service";
import { CookieService } from "@/services/cookie.service";
import { COMMON_METADATA } from "@/constants/metadata/common.metadata";
import { delay } from "../utils";

const api: AxiosInstance = axios.create({});
const authService = new AuthService();

export const mstsRefreshTokenInterceptor:
	| ((error: any) => any)
	| null
	| undefined = async error => {
	const originalRequest = error.config;
	if (
		(error.response?.status === 401 || error.response?.status === 403) &&
		!originalRequest.retry
	) {
		originalRequest.retry = true;

		const cookieService = new CookieService();

		const cookieKey = COMMON_METADATA.MSTS_TOKEN_ALREADY_REQUESTED;

		if (cookieService.getCookie(cookieKey)) {
			while (true) {
				if (!cookieService.getCookie(cookieKey)) {
					break;
				}
				await delay(1000);
			}

			const tokenData = authService.getMSTSTokenData();
			originalRequest.headers.Authorization = `Bearer ${tokenData.access_token}`;
			return api(originalRequest);
		}

		cookieService.setCookie(cookieKey, true);
		const previousTokenData = authService.getMSTSTokenData();
		const tokenData = await authService.refreshAuthorizationToken(
			previousTokenData.refresh_token,
		);
		cookieService.setCookie(cookieKey, false);

		originalRequest.headers.Authorization = `Bearer ${tokenData.access_token}`;
		return api(originalRequest);
	}
	return Promise.reject(error);
};

export const successResponse = (response: AxiosResponse) => response;
