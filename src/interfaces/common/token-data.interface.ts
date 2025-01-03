export interface TokenData {
	access_token: string;
	id_token: string;
	expires_at: number;
	token_type: string;
	scope: string;
	profile: string;
	state: string;
	expires_in: number;
	expired: string;
	scopes: string;
	contact_id: number;
}
export interface jwtDecodeData {
	iss?: string;
	sub?: string;
	aud?: string[] | string;
	exp?: number;
	nbf?: number;
	iat?: number;
	jti?: string;
	ContactId?: number;
}
