import { NON_URL_KEYS, URL_KEYS } from "@/lib/constant/env.constant";
import axios from "axios";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

type SecureWrapperProviderType = {
	children: ReactNode;
	baseUrl?: string;
};
type SecureEnvType = Record<string, string | undefined>;

let cachedEnvData: SecureEnvType | null = null;

export const SecureContext = createContext<SecureEnvType>({});
export const getSecureEnv = (): SecureEnvType | null => cachedEnvData;

const normalizeUrl = (url?: string): string | undefined =>
	url?.endsWith("/") ? url : `${url}/`;

const normalizeEnv = (
	rawEnv: Record<string, string | undefined>,
): SecureEnvType => {
	const urls = URL_KEYS.reduce((acc, key) => {
		acc[key] = normalizeUrl(rawEnv[key]);
		return acc;
	}, {} as SecureEnvType);

	const nonUrls = NON_URL_KEYS.reduce((acc, key) => {
		acc[key] = rawEnv[key];
		return acc;
	}, {} as SecureEnvType);

	return { ...urls, ...nonUrls };
};

export const SecureWrapperProvider = ({
	children,
	baseUrl,
}: SecureWrapperProviderType) => {
	const [envData, setEnvData] = useState<SecureEnvType | null>(cachedEnvData);

	useEffect(() => {
		const fetchEnv = async () => {
			if (cachedEnvData) return;

			try {
				const url = baseUrl
					? `${baseUrl.replace(/\/$/, "")}/api/env`
					: "/api/env";
				const response = await axios.get(url);
				const normalized = normalizeEnv(response.data);
				cachedEnvData = normalized;
				setEnvData(normalized);
			} catch (e) {
				console.error("API call to /api/env failed:", e);
				setEnvData({});
			}
		};

		fetchEnv();
	}, [baseUrl]);

	if (envData && envData.NEXT_PUBLIC_APP_MANIFEST_ENVIRONMENT !== "DEV") {
		console.log = () => {};
		console.error = () => {};
		console.warn = () => {};
	}

	if (!envData || Object.keys(envData).length === 0) {
		return null;
	}

	return (
		<SecureContext.Provider value={envData}>{children}</SecureContext.Provider>
	);
};

export const useSecureEnv = (): SecureEnvType => {
	const env = useContext(SecureContext);
	if (!env)
		throw new Error("useSecureEnv must be used within SecureWrapperProvider");
	return env;
};
