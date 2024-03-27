import { InternalAxiosRequestConfig } from "axios";
import AuthService from "@/services/auth.service";

export const authRequestInterceptor = async (
	config: InternalAxiosRequestConfig,
) => {
	const newConfig = config;
	const authService = new AuthService();
	const tokenData = authService.getOMNITokenData();

	if (tokenData && tokenData.access_token) {
		newConfig.headers!.authorization = `Bearer ${tokenData.access_token}`;
		newConfig.headers!.Accept = "application/json";
		return newConfig;
	}
	await authService.login();

	return newConfig;
};
