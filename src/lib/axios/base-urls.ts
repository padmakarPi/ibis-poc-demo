import { createAxiosInstance } from "./axios";

export const securityServiceAxios = createAxiosInstance(
	process.env.NEXT_PUBLIC_VSECURITY_BASE_API_URL,
);
