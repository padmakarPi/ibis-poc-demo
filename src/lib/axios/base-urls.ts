import { createAxiosInstance } from "./axios";

// Add all Base URL from ENV
export const serviceAxios = createAxiosInstance(
	// import base url like this one
	process.env.NEXT_PUBLIC_VESSEL_BASE_API_URL,
);
