import { InternalAxiosRequestConfig } from "axios";
import AuthService from "@/services/auth.service";

export const authRequestInterceptor = async (
	config: InternalAxiosRequestConfig,
) => {
	const authService = new AuthService();
	const newConfig = config;

	const tokenData: any = JSON.parse(localStorage.getItem("token") || "{}");
	if (tokenData && tokenData.access_token && tokenData.expireAt > Date.now()) {
		if (tokenData.access_token) {
			newConfig.headers!.authorization = `Bearer ${tokenData.access_token}`;
		}
		newConfig.headers!.Accept = "application/json";
		return config;
	}
	if (tokenData.refresh_token) {
		const newTokenData = await authService.getToken();
		if (newTokenData.access_token) {
			newConfig.headers!.authorization = `Bearer ${newTokenData.access_token}`;
		}
		newConfig.headers!.Accept = "application/json";
		return newConfig;
	}
	return newConfig;
};
