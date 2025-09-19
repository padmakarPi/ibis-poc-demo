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

type SecureEnvType = { [key: string]: string };
let cachedEnvData: SecureEnvType | null = null;

export const SecureContext = createContext<SecureEnvType>({});

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
				cachedEnvData = response.data;
				setEnvData(response.data);
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

export const useSecureEnv = () => useContext(SecureContext);
