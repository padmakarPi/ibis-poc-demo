import { OIDC_CONFIG } from "@/lib/config/config";
import { ReactNode, createContext, useEffect, useState } from "react";
import { User, UserManager } from "oidc-client";
import { jwtDecode } from "jwt-decode";

import { COMMON_METADATA } from "@/lib/constant/oidc";
import { jwtDecodeData } from "@/interfaces/common/token-data.interface";
import { useRouter } from "next/router";

interface defaultState {
	userManager: UserManager | null;
	saveToken: (data: User) => void;
	getUser: () => Promise<User | null | undefined>;
	login: () => unknown;
	logout: () => unknown;
}

export const AuthContext = createContext<defaultState>({} as defaultState);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [userManager, setUserManager] = useState<UserManager | null>(null);
	const router = useRouter();
	const checkAuthentication = async () => {
		const token = localStorage.getItem(COMMON_METADATA.OMNI_TOKEN_STORE_KEY);
		if (token) {
			return true;
		}
		return false;
	};

	useEffect(() => {
		const authenticate = async () => {
			if (router.pathname.startsWith("/auth") || router.pathname === "/") {
				return null;
			}
			const isAuthenticated = await checkAuthentication();
			if (!isAuthenticated) {
				router.push("/");
			}
			return null;
		};

		authenticate();
	}, []);

	const login = async () => {
		try {
			if (userManager) {
				const loginData = await userManager.signinRedirect();
				return loginData;
			}
			return null;
		} catch (error) {
			console.error(error);
		}
		return null;
	};

	const logout = async () => {
		try {
			if (userManager) {
				localStorage.removeItem(COMMON_METADATA.OMNI_TOKEN_STORE_KEY);
				const logoutData = await userManager.signoutRedirect();
				return logoutData;
			}
			return null;
		} catch (error) {
			console.error(error);
		}
		return null;
	};

	const getUser = async () => {
		try {
			if (userManager) {
				const user = await userManager.getUser();
				return user;
			}
			return null;
		} catch (error) {
			console.error(error);
		}
		return null;
	};

	const saveToken = async (data: User) => {
		try {
			const decoded: jwtDecodeData = jwtDecode(data.access_token);
			localStorage.setItem(
				COMMON_METADATA.OMNI_TOKEN_STORE_KEY,
				JSON.stringify({
					...data,
					expireAt: decoded.exp,
				}),
			);
		} catch (error) {
			console.error(error);
		}
	};
	const initializeAuth = async () => {
		OIDC_CONFIG.redirect_uri = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/oidc-callback`;
		const manager = new UserManager(OIDC_CONFIG);
		setUserManager(manager);

		manager.events.addUserSignedOut(async () => {
			await logout();
		});
	};

	useEffect(() => {
		initializeAuth();
	}, []);
	if (!userManager) {
		return <div>loading</div>;
	}
	return (
		<AuthContext.Provider
			value={{ userManager, getUser, saveToken, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};
