import Axios, { AxiosInstance } from "axios";
import { authRequestInterceptor } from "./auth-request.Interceptor";
import {
	refreshTokenInterceptor,
	successResponse,
} from "./refresh-token.Interceptor";
import { mstsAuthRequestInterceptor } from "./msts-auth-request.Interceptor";
import { mstsRefreshTokenInterceptor } from "./msts-refresh-token.Interceptor";

export const createAxiosInstance = (
	baseURL: string | undefined,
): AxiosInstance => {
	const axiosInstance: AxiosInstance = Axios.create({
		baseURL,
	});

	axiosInstance.interceptors.request.use(authRequestInterceptor);
	axiosInstance.interceptors.response.use(
		successResponse,
		refreshTokenInterceptor,
		{ synchronous: true },
	);

	return axiosInstance;
};

export const createMSTSAxiosInstance = ({
	baseURL,
}: {
	baseURL: string | undefined;
}): AxiosInstance => {
	const axiosInstance: AxiosInstance = Axios.create({
		baseURL,
	});

	axiosInstance.interceptors.request.use(mstsAuthRequestInterceptor);
	axiosInstance.interceptors.response.use(
		successResponse,
		mstsRefreshTokenInterceptor,
		{ synchronous: true },
	);

	return axiosInstance;
};
