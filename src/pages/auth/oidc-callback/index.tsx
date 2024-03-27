import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { userManager } from "@/constants/config/oidc.config";
import AuthService from "@/services/auth.service";
import { CookieService } from "@/services/cookie.service";
import { setAuthState } from "@/redux/reducers/auth.reducer";

function CallbackPage() {
	const router = useRouter();
	const authService = new AuthService();
	const cookieService = new CookieService();
	const [email, setEmail] = useState("");
	const dispatch = useDispatch();

	const getUserData = async () => {
		const userData = await authService.getUser();
		if (userData && userData.profile && userData.profile.email) {
			authService.saveOmniDataToLocalStorage(userData);
			setEmail(userData.profile.email);
			cookieService.setCookie("isAuthenticated", true);
			dispatch(
				setAuthState({
					email: userData.profile.email,
					name: userData.profile.name,
					userType: userData.profile.UserType,
					sid: userData.profile.sid,
					expires_at: userData.expires_at,
					profile:
						userData?.profile?.Portals && JSON.parse(userData?.profile?.Portals)
							? JSON.parse(userData?.profile?.Portals)
							: [],
					jobRole: "",
					customer_id: 0,
					user_id: userData.profile.sub,
				}),
			);
		}
	};

	useEffect(() => {
		userManager.signinRedirectCallback().then(() => {
			getUserData();
		});
	}, []);

	const getMSTSToken = async (_email: string) => {
		await authService.loginAuthorization(_email);
		const previousRoute = localStorage.getItem("originalRoute") ?? "/";
		const originalRoute = previousRoute === "/" ? "/homepage" : previousRoute;
		router.push(originalRoute);
	};

	useEffect(() => {
		if (email) {
			getMSTSToken(email);
		}
	}, [email]);

	return <div>Processing OIDC callback...</div>;
}

export default CallbackPage;
