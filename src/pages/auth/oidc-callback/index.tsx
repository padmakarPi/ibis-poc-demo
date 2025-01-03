import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/authcontext/AuthContext";
import { useDispatch } from "react-redux";
import { setAuthState } from "@/redux/slices/authslice";
import Cookies from "js-cookie";
import { SECURITY } from "@/lib/constant/apiconstant";
import axios from "axios";
import WelcomeScreenMicroFrontEnd from "@/components/microfrontends/WelcomeScreenMicrofrontend";
import { SESSION_STORAGE_KEYS } from "@/lib/constant/oidc";
import { getOriginalRoute } from "@/lib/utils";

function CallbackPage() {
	const router = useRouter();
	const { getUser, saveToken, userManager } = useContext(AuthContext);
	const dispatch = useDispatch();
	const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || "";
	const [redirectUrl, setRedirectUrl] = useState("");

	const checkApplicationAccess = async (token: string) => {
		try {
			const axiosInstance = axios.create({
				baseURL: process.env.NEXT_PUBLIC_VSECURITY_BASE_API_URL,
			});

			const res = await axiosInstance.get(
				`${SECURITY.CHECKAPPLICATIONACCESS}?clientId=${clientId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			return res.data.result;
		} catch (error) {
			console.error("Error checking application access:", error);
			return false;
		}
	};

	const redirectUser = (returnUrl: string) => {
		sessionStorage.setItem(SESSION_STORAGE_KEYS.ORIGINALROUTE, returnUrl);
		const originalRoute = getOriginalRoute();
		router.push(originalRoute);
	};

	useEffect(() => {
		if (redirectUrl) {
			redirectUser(redirectUrl);
		}
	}, [redirectUrl]);

	const getUserData = async (state: { returnUrl: string }) => {
		const userData = await getUser();
		if (userData && userData.profile && userData.profile.email) {
			saveToken(userData);
			Cookies.set("isAuthenticated", "true", {
				sameSite: "None",
				secure: true,
			});
			dispatch(
				setAuthState({
					isAuthenticated: true,
					email: userData.profile.email,
					name: userData.profile.name,
					userType: userData.profile.UserType,
					sid: userData.profile.sid,
					access_token: userData.access_token,
					expires_at: userData.expires_at,
					jobRole: "",
					sub: userData.profile.sub,
				}),
			);
			setRedirectUrl(state.returnUrl);
		}
	};

	useEffect(() => {
		if (userManager) {
			userManager.signinRedirectCallback().then(async user => {
				const userData = await getUser();

				if (!userData?.access_token) {
					router.push(
						`${process.env.NEXT_PUBLIC_STS_AUTHORITY}/Account/AccessDenied`,
					);
					return;
				}

				const canApplicationAccessible = await checkApplicationAccess(
					userData.access_token,
				);
				if (!canApplicationAccessible) {
					router.push(
						`${process.env.NEXT_PUBLIC_STS_AUTHORITY}/Account/AccessDenied`,
					);
					return;
				}
				getUserData(user.state);
			});
		}
	}, [userManager]);

	return (
		<WelcomeScreenMicroFrontEnd
			currentStep={1}
			IsCallBackPage={true}
			healthCheckList={[]}
			handleHealthCheck={() => {}}
		/>
	);
}

export default CallbackPage;
