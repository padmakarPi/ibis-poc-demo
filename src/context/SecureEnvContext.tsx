import { createContext, ReactNode, useContext } from "react";
import envData from "../../public/env.json";

type SecureWrapperProviderType = {
	children: ReactNode;
};

export const SecureContext = createContext<{ [key: string]: string }>({});

export const SecureWrapperProvider = ({
	children,
}: SecureWrapperProviderType) => (
	<SecureContext.Provider value={envData}>{children}</SecureContext.Provider>
);

export const useSecureEnv = () => useContext(SecureContext);
