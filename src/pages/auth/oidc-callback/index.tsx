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
import { useRuntimeEnv } from "@/hooks/customhooks/useRuntimeEnv";

function CallbackPage() {
	const router = useRouter();
	const { getUser, saveToken, userManager } = useContext(AuthContext);
	const dispatch = useDispatch();
	const {
		NEXT_PUBLIC_CLIENT_ID,
		NEXT_PUBLIC_VSECURITY_BASE_API_URL,
		NEXT_PUBLIC_STS_AUTHORITY,
		NEXT_PUBLIC_ORIGIN,
		NEXT_PUBLIC_BASE_PATH,
	} = useRuntimeEnv();
	const clientId = NEXT_PUBLIC_CLIENT_ID || "";
	const [redirectUrl, setRedirectUrl] = useState("");
	const checkApplicationAccess = async (token: string) => {
		try {
			const axiosInstance = axios.create({
				baseURL: NEXT_PUBLIC_VSECURITY_BASE_API_URL,
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
		if (userData && userData.profile) {
			saveToken(userData);
			Cookies.set("isAuthenticated", "true", {
				sameSite: "None",
				secure: true,
			});
			dispatch(
				setAuthState({
					isAuthenticated: true,
					email: userData?.profile?.email,
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
					router.push(`${NEXT_PUBLIC_STS_AUTHORITY}Account/AccessDenied`);
					return;
				}

				const canApplicationAccessible = await checkApplicationAccess(
					userData.access_token,
				);
				if (!canApplicationAccessible) {
					router.push(`${NEXT_PUBLIC_STS_AUTHORITY}Account/AccessDenied`);
					return;
				}
				getUserData(user.state);
			});
		}
	}, [userManager]);

	const getWelcomeScreenRefreshRedirectUrl = () => {
		const originalRoute = sessionStorage.getItem(
			SESSION_STORAGE_KEYS.ORIGINALROUTE,
		);
		const pathBasedUrl = `${NEXT_PUBLIC_ORIGIN}${NEXT_PUBLIC_BASE_PATH}`;

		if (originalRoute) {
			return `${pathBasedUrl}${originalRoute}`;
		}

		return pathBasedUrl;
	};

	return (
		<WelcomeScreenMicroFrontEnd
			currentStep={1}
			IsCallBackPage={true}
			healthCheckList={[]}
			handleHealthCheck={() => {}}
			onRefreshRedirectUrl={getWelcomeScreenRefreshRedirectUrl}
		/>
	);
}

export default CallbackPage;
