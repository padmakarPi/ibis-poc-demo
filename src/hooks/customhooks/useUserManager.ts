import { UserManager, WebStorageStateStore } from "oidc-client";
import { useMemo } from "react";
import { useRuntimeEnv } from "./useRuntimeEnv";

export function useUserManager() {
	const {
		NEXT_PUBLIC_BASE_PATH,
		NEXT_PUBLIC_CLIENT_SCOPE,
		NEXT_PUBLIC_ORIGIN,
		NEXT_PUBLIC_REDIRECT_URL,
		NEXT_PUBLIC_RESPONSE_TYPE,
		NEXT_PUBLIC_STS_AUTHORITY,
		NEXT_PUBLIC_CLIENT_ID,
	} = useRuntimeEnv();

	const userManager = useMemo(() => {
		if (
			!NEXT_PUBLIC_STS_AUTHORITY ||
			!NEXT_PUBLIC_CLIENT_ID ||
			!NEXT_PUBLIC_RESPONSE_TYPE ||
			!NEXT_PUBLIC_CLIENT_SCOPE ||
			!NEXT_PUBLIC_ORIGIN
		) {
			return null;
		}

		const basePath = NEXT_PUBLIC_BASE_PATH || "";
		const origin = NEXT_PUBLIC_ORIGIN || "";

		const OIDC_CONFIG = {
			authority: NEXT_PUBLIC_STS_AUTHORITY,
			client_id: NEXT_PUBLIC_CLIENT_ID,
			redirect_uri: NEXT_PUBLIC_REDIRECT_URL
				? `${NEXT_PUBLIC_REDIRECT_URL}auth/oidc-callback`
				: `${origin}${basePath}auth/oidc-callback`,
			response_type: NEXT_PUBLIC_RESPONSE_TYPE,
			scope: NEXT_PUBLIC_CLIENT_SCOPE,
			post_logout_redirect_uri: `${origin}${basePath}signout-callback-oidc`,
			userStore: new WebStorageStateStore({ store: window.sessionStorage }),
		};

		return new UserManager(OIDC_CONFIG);
	}, [
		NEXT_PUBLIC_STS_AUTHORITY,
		NEXT_PUBLIC_CLIENT_ID,
		NEXT_PUBLIC_RESPONSE_TYPE,
		NEXT_PUBLIC_CLIENT_SCOPE,
		NEXT_PUBLIC_ORIGIN,
		NEXT_PUBLIC_BASE_PATH,
	]);

	return userManager;
}
