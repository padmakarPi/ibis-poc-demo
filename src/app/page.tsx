"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthState } from "@/redux/reducers/auth.reducer";
import AuthService from "@/services/auth.service";
import { CookieService } from "@/services/cookie.service";
import { AUTH_COOKIES_METADATA } from "@/constants/metadata/common.metadata";

export default function Home() {
	const router = useRouter();
	const authService = new AuthService();
	const cookieService = new CookieService();
	const [redirectTo, setRedirectTo] = useState("");
	const dispatch = useDispatch();

	useEffect(() => {
		try {
			const parseData = {
				access_token: cookieService.getCookie(
					AUTH_COOKIES_METADATA.ACCESS_TOKEN,
				),
				id_token: cookieService.getCookie(AUTH_COOKIES_METADATA.ID_TOKEN),
				expires_at: cookieService.getCookie(AUTH_COOKIES_METADATA.EXPIRES_AT),
				token_type: cookieService.getCookie(AUTH_COOKIES_METADATA.TOKEN_TYPE),
				scope: cookieService.getCookie(AUTH_COOKIES_METADATA.SCOPE),
				profile: cookieService.getCookie(AUTH_COOKIES_METADATA.PROFILE),
				state: cookieService.getCookie(AUTH_COOKIES_METADATA.STATE),
				expires_in: cookieService.getCookie(AUTH_COOKIES_METADATA.EXPIRES_IN),
				expired: cookieService.getCookie(AUTH_COOKIES_METADATA.EXPIRED),
				scopes: cookieService.getCookie(AUTH_COOKIES_METADATA.SCOPES),
				toStorageString() {
					const dataToStore = { ...this };
					return JSON.stringify(dataToStore);
				},
			};
			if (
				parseData &&
				parseData.access_token &&
				parseData.id_token &&
				parseData.id_token
			) {
				authService.storeUser(parseData);
				dispatch(
					setAuthState({
						isAuthenticated: true,
						email: parseData.profile.email,
						name: parseData.profile.name,
						userType: parseData.profile.UserType,
						sid: parseData.profile.sid,
						access_token: parseData.access_token,
						expires_at: parseData.expires_at,
						profile:
							parseData?.profile?.Portals &&
							JSON.parse(parseData?.profile?.Portals)
								? JSON.parse(parseData?.profile?.Portals)
								: [],
					}),
				);
				setRedirectTo("home");
			} else {
				authService.login();
			}
		} catch (error: any) {
			console.log("error is", error);
		}
	}, []);

	useEffect(() => {
		if (redirectTo) {
			router.push(`/${redirectTo}`);
		}
	}, [redirectTo]);

	return <h1>Authentication processing...</h1>;
}
