import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

type SecureWrapperProviderType = {
	children: ReactNode;
};

type SecureEnvType = { [key: string]: string };
let cachedEnvData: SecureEnvType | null = null;
export const SecureContext = createContext<SecureEnvType>({});

export const SecureWrapperProvider = ({
	children,
}: SecureWrapperProviderType) => {
	const [envData, setEnvData] = useState<SecureEnvType | null>(cachedEnvData);

	useEffect(() => {
		const fetchEnv = async () => {
			if (cachedEnvData) return;
			const isDev =
				typeof window !== "undefined" &&
				window.location.hostname === "localhost";
			// add base path if your DNS contain the base path else use /api/env.
			const url = isDev ? "/api/env" : "/api/env";

			try {
				const res = await fetch(url, {
					headers: { "Cache-Control": "no-cache" },
				});
				if (!res.ok) throw new Error("Failed to fetch env via API");
				const data = await res.json();
				cachedEnvData = data;
				setEnvData(data);
			} catch (e) {
				console.error("API call to /api/env failed:", e);
				setEnvData({});
			}
		};

		fetchEnv();
	}, []);

	if (!envData || Object.keys(envData).length === 0) {
		return null;
	}
	return (
		<SecureContext.Provider value={envData}>{children}</SecureContext.Provider>
	);
};

export const useSecureEnv = () => useContext(SecureContext);
