export const OIDC_CONFIG = {
	authority: process.env.NEXT_PUBLIC_STS_AUTHORITY,
	client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
	redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL || "",
	response_type: process.env.NEXT_PUBLIC_RESPONSE_TYPE,
	scope: process.env.NEXT_PUBLIC_CLIENT_SCOPE,
	post_logout_redirect_uri: "",
};
