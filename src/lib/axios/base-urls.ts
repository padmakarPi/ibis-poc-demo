import { createAxiosInstance } from "./axios";

// Add all Base URL from ENV
export const vesselServiceAxios = createAxiosInstance(
	// import base url like this one
	process.env.NEXT_PUBLIC_VESSEL_BASE_API_URL,
);
