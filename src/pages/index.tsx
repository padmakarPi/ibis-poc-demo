"use client";

import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/authcontext/AuthContext";
import WelcomeScreenMicroFrontEnd from "@/components/microfrontends/WelcomeScreenMicrofrontend";
import { SESSION_STORAGE_KEYS } from "@/lib/constant/oidc";
import { getOriginalRoute } from "@/lib/utils";

export default function Main() {
	const { getUser, login } = useContext(AuthContext);
	const router = useRouter();
	const initializeAuth = async () => {
		try {
			const user = await getUser();
			if (user) {
				const originalRoute = getOriginalRoute();
				router.push(originalRoute);
			} else {
				await login();
			}
			return null;
		} catch (error) {
			console.log("error=", error);
			return null;
		}
	};

	useEffect(() => {
		const isNotCallbackRoute = !router.asPath.startsWith("/auth/oidc-callback");
		if (isNotCallbackRoute) {
			sessionStorage.setItem(SESSION_STORAGE_KEYS.ORIGINALROUTE, router.asPath);
		}
		if (isNotCallbackRoute) {
			initializeAuth();
		}
	}, []);

	return <WelcomeScreenMicroFrontEnd currentStep={0} IsCallBackPage={false} />;
}
