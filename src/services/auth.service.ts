import { User } from "oidc-client";
import * as qs from "qs";
import {
	setLocalStorage,
	getStorageValue,
} from "@/services/localstorage.service";
import { CookieService } from "@/services/cookie.service";
// eslint-disable-next-line import/no-cycle
import { userManager } from "@/constants/config/oidc.config";
import { COMMON_METADATA } from "@/constants/metadata/common.metadata";
import { TokenData } from "@/interfaces/common/token-data.interface";

export default class AuthService {
	private cookieService = new CookieService();

	private static isLogoutTriggered: boolean = false;

	private userManager = userManager;

	public getUser(): Promise<User | null> {
		return this.userManager.getUser();
	}

	public login(): Promise<void> {
		return this.userManager.signinRedirect();
	}

	public renewToken(): Promise<User> {
		return this.userManager.signinSilent();
	}

	public storeUser(user: User): Promise<void> {
		return this.userManager.storeUser(user);
	}

	public async logout() {
		if (AuthService.isLogoutTriggered) {
			return;
		}
		AuthService.isLogoutTriggered = true;

		if (
			this.cookieService.cookieExists(
				COMMON_METADATA.MSTS_TOKEN_ALREADY_REQUESTED,
			)
		) {
			this.cookieService.deleteCookie(
				COMMON_METADATA.MSTS_TOKEN_ALREADY_REQUESTED,
			);
		}

		if (
			this.cookieService.cookieExists(
				COMMON_METADATA.OMNI_TOKEN_ALREADY_REQUESTED,
			)
		) {
			this.cookieService.deleteCookie(
				COMMON_METADATA.OMNI_TOKEN_ALREADY_REQUESTED,
			);
		}

		const keys = Object.keys(sessionStorage);

		keys.forEach(key => {
			if (!key.startsWith("oidc.user:")) {
				sessionStorage.removeItem(key);
			}
		});

		setLocalStorage(COMMON_METADATA.TOKEN_STORE_KEY, "");
		setLocalStorage(COMMON_METADATA.OMNI_TOKEN_STORE_KEY, "");

		await this.userManager.signoutRedirect();
		await this.cookieService.deleteAllCookies();
	}

	public saveOmniDataToLocalStorage(data: User) {
		localStorage.setItem(
			COMMON_METADATA.OMNI_TOKEN_STORE_KEY,
			JSON.stringify({
				...data,
			}),
		);
	}

	public loginAuthorization(email: string) {
		return new Promise<TokenData>((resolve, reject) => {
			const body = {
				client_id: btoa(
					process.env.NEXT_PUBLIC_MSTS_CLIENT_ID ||
						"277AFC1D-AF71-4D58-BF11-A9F4FEFAD187",
				),
				client_secret: btoa(
					process.env.NEXT_PUBLIC_MSTS_CLIENT_SECRET ||
						"E66B022B-954B-4BCA-B108-E517D00BC4D4",
				),
				grant_type: process.env.NEXT_PUBLIC_MSTS_GRANT_TYPE || "password",
				userName: btoa(email),
				password: btoa(
					process.env.NEXT_PUBLIC_MSTS_GRANT_PASSWORD || "omniauth",
				),
			};
			const data = qs.stringify(body);
			fetch(
				process.env.NEXT_PUBLIC_OMNI_URL ||
					"https://dev-msts.v.group/omnijwttoken",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: data,
				},
			)
				.then(response => response.json())
				.then(respData => {
					if (respData) {
						if (respData?.error) {
							return;
						}
						const tokenData: TokenData = {
							...respData,
						};
						setLocalStorage(
							COMMON_METADATA.TOKEN_STORE_KEY,
							JSON.stringify(tokenData),
						);
						resolve(tokenData);
					} else {
						reject(new Error("Something went wrong"));
					}
				})
				.catch(error => {
					reject(error);
				});
		});
	}

	public refreshAuthorizationToken(refreshToken: string) {
		return new Promise<TokenData>((resolve, reject) => {
			const body = {
				client_id: btoa(
					process.env.NEXT_PUBLIC_MSTS_CLIENT_ID ||
						"277AFC1D-AF71-4D58-BF11-A9F4FEFAD187",
				),
				client_secret: btoa(
					process.env.NEXT_PUBLIC_MSTS_CLIENT_SECRET ||
						"E66B022B-954B-4BCA-B108-E517D00BC4D4",
				),
				grant_type: "refresh_token",
				refresh_token: refreshToken,
			};
			const data = qs.stringify(body);

			fetch(
				process.env.NEXT_PUBLIC_OMNI_URL ||
					"https://dev-msts.v.group/omnijwttoken",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: data,
				},
			)
				.then(response => response.json())
				.then(responseData => {
					if (responseData) {
						if (responseData?.error) {
							this.logout();
							return;
						}
						const tokenData: TokenData = {
							...responseData,
						};
						setLocalStorage(
							COMMON_METADATA.TOKEN_STORE_KEY,
							JSON.stringify(tokenData),
						);
						resolve(tokenData);
					} else {
						this.logout();
						reject(new Error("Something went wrong"));
					}
				})
				.catch(error => {
					this.logout();
					reject(error);
				});
		});
	}

	public getToken = async (): Promise<any> => {
		const authService = new AuthService();
		const tokenData = getStorageValue("token");
		if (!tokenData || !tokenData.access_token) {
			this.logout();
		} else if (
			tokenData &&
			tokenData.access_token &&
			tokenData.expireAt > Date.now()
		) {
			return tokenData;
		} else if (tokenData && tokenData.refresh_token) {
			await authService.refreshAuthorizationToken(tokenData.refresh_token);
			return this.getToken();
		}
		return null;
	};

	public async refreshOMNIToken() {
		const tokenData = this.getOMNITokenData();

		const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || "";

		const requestBody = new URLSearchParams();
		requestBody.append("grant_type", "refresh_token");
		requestBody.append("client_id", clientId);
		requestBody.append("refresh_token", tokenData.refresh_token);

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_STS_AUTHORITY}/connect/token`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: requestBody,
				},
			);

			if (!response.ok) {
				await this.logout();
			}

			const data = await response.json();
			this.saveOmniDataToLocalStorage(data);
			return data.access_token;
		} catch (error) {
			/* empty */
		}
		return "";
	}

	public isOMNITokenExpired() {
		const tokenData = this.getOMNITokenData();

		if (!tokenData) {
			return true;
		}

		if (!tokenData.access_token) {
			return true;
		}

		return Date.now() >= tokenData.expireAt * 1000;
	}

	public getOMNITokenData() {
		return JSON.parse(
			localStorage.getItem(COMMON_METADATA.OMNI_TOKEN_STORE_KEY) || "{}",
		);
	}

	public getMSTSTokenData() {
		return JSON.parse(
			localStorage.getItem(COMMON_METADATA.TOKEN_STORE_KEY) || "{}",
		);
	}
}
