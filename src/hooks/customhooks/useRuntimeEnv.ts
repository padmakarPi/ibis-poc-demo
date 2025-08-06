import { useContext } from "react";
import { SecureContext } from "@/context/SecureEnvContext";
import { NON_URL_KEYS, URL_KEYS } from "@/lib/constant/env.constant";

const normalizeUrl = (url?: string): string | undefined =>
	url?.endsWith("/") ? url : `${url}/`;

export const useRuntimeEnv = () => {
	const env = useContext(SecureContext);
	if (!env)
		throw new Error("useRuntimeEnv must be used within SecureContext.Provider");

	const urls = URL_KEYS.reduce(
		(acc, key) => {
			acc[key] = normalizeUrl(env[key]);
			return acc;
		},
		{} as Record<string, string | undefined>,
	);

	const nonUrls = NON_URL_KEYS.reduce(
		(acc, key) => {
			acc[key] = env[key];
			return acc;
		},
		{} as Record<string, string | undefined>,
	);

	return { ...urls, ...nonUrls };
};
