"use client";

import { ReactNode, createContext, useEffect } from "react";
import { User, UserManager } from "oidc-client";
import { jwtDecode } from "jwt-decode";

import { COMMON_METADATA } from "@/lib/constant/oidc";
import { jwtDecodeData } from "@/interfaces/common/token-data.interface";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setAuthState } from "@/redux/slices/authslice";
import { getOriginalRoute } from "@/lib/utils";
import { useUserManager } from "@/hooks/customhooks/useUserManager";
import * as Sentry from "@sentry/nextjs";

interface defaultState {
	userManager: UserManager | null;
	saveToken: (data: User) => void;
	getUser: () => Promise<User | null | undefined>;
	login: () => unknown;
	logout: () => unknown;
}

export const AuthContext = createContext<defaultState>({} as defaultState);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const router = useRouter();
	const dispatch = useDispatch();
	const userManager = useUserManager();

	const checkAuthentication = async () => {
		const token = localStorage.getItem(COMMON_METADATA.OMNI_TOKEN_STORE_KEY);
		if (token) {
			const userData: any = jwtDecode(JSON.parse(token).access_token);
			dispatch(
				setAuthState({
					isAuthenticated: true,
					email: userData?.email,
					name: userData?.name,
					userType: userData?.UserType,
					sid: userData?.sid,
					access_token: userData?.access_token,
					expires_at: userData?.exp,
					jobRole: "",
					sub: userData?.sub,
				}),
			);
			return true;
		}
		return false;
	};

	useEffect(() => {
		if (!router.isReady) return;

		const authenticate = async () => {
			const { pathname } = router;
			if (
				pathname.startsWith("/auth") ||
				pathname === "/" ||
				pathname === "/health/ready" ||
				pathname === "/health/live"
			) {
				return;
			}
			const isAuthenticated = await checkAuthentication();
			if (!isAuthenticated) {
				await router.push("/");
			}
		};

		authenticate().catch(() => undefined);
	}, [router.isReady, router.pathname]);

	const clearAppStates = () => {
		if (Cookies.get(COMMON_METADATA.OMNI_TOKEN_ALREADY_REQUESTED)) {
			Cookies.remove(COMMON_METADATA.OMNI_TOKEN_ALREADY_REQUESTED);
		}

		const keys = Object.keys(sessionStorage);

		const excludeSessionKeys = ["oidc.", "originalRoute"];

		keys
			.filter(k => !excludeSessionKeys.some(e => k.startsWith(e)))
			.forEach(key => {
				sessionStorage.removeItem(key);
			});
		Cookies.remove("isAuthenticated");
		Sentry.setUser(null);
	};

	const login = async () => {
		try {
			if (userManager) {
				const originalRoute = getOriginalRoute();
				const loginData = await userManager.signinRedirect({
					state: { returnUrl: originalRoute },
				});
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
				localStorage.setItem(COMMON_METADATA.OMNI_TOKEN_STORE_KEY, "");
				clearAppStates();
				await userManager.signoutRedirect();
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

	return (
		<AuthContext.Provider
			value={{ userManager, getUser, saveToken, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};
