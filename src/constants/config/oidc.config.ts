// eslint-disable-next-line import/no-cycle
import AuthService from "@/services/auth.service";
import { Log, UserManager } from "oidc-client";

const OIDC_CONFIG = {
	authority: process.env.NEXT_PUBLIC_STS_AUTHORITY,
	client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
	redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL || "",
	response_type: process.env.NEXT_PUBLIC_RESPONSE_TYPE,
	scope: process.env.NEXT_PUBLIC_CLIENT_SCOPE,
	post_logout_redirect_uri: "",
};

// eslint-disable-next-line import/no-mutable-exports
let userManager: UserManager;
if (typeof window !== "undefined") {
	if (window && window.location.origin) {
		OIDC_CONFIG.redirect_uri = `${window.location.origin}/auth/oidc-callback`;
		OIDC_CONFIG.post_logout_redirect_uri = `${window.location.origin}/signout-callback-oidc`;
	}
	userManager = new UserManager(OIDC_CONFIG);
	Log.logger = console;
	Log.level = Log.INFO;
	userManager.events.addUserSignedOut(async () => {
		console.log("LOGOUT");
		await new AuthService().logout();
	});
}

export { OIDC_CONFIG, userManager };
