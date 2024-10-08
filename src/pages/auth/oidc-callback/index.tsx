import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/authcontext/AuthContext";
import { useDispatch } from "react-redux";
import { setAuthState } from "@/redux/slices/authslice";
import Cookies from "js-cookie";
import { SECURITY } from "@/lib/constant/apiconstant";
import useAxiosInterceptor from "@/hooks/customhooks/useAxiosInstance";

function CallbackPage() {
	const router = useRouter();
	const { getUser, saveToken, userManager } = useContext(AuthContext);
	const dispatch = useDispatch();
	const { axBe }: any = useAxiosInterceptor(
		process.env.NEXT_PUBLIC_VSECURITY_BASE_API_URL,
	);
	const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || "";

	const checkApplicationAccess = async () => {
		try {
			const res = await axBe.get(
				`${SECURITY.CHECKAPPLICATIONACCESS}?clientId=${clientId}`,
			);
			return res.data.result;
		} catch (error) {
			console.error("Error checking application access:", error);
			return false;
		}
	};
	const getUserData = async () => {
		const userData = await getUser();
		if (userData && userData.profile && userData.profile.email) {
			saveToken(userData);
			const originalRoute = "/homepage";
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
					customer_id: 0,
					sub: userData.profile.sub,
				}),
			);
			router.push(originalRoute);
		}
	};

	useEffect(() => {
		if (userManager) {
			userManager.signinRedirectCallback().then(async () => {
				const canApplicationAccessible = await checkApplicationAccess();
				if (!canApplicationAccessible) {
					router.push(
						`${process.env.NEXT_PUBLIC_STS_AUTHORITY}/Account/AccessDenied`,
					);
					return;
				}
				getUserData();
			});
		}
	}, [userManager]);

	return <div>Processing OIDC callback...</div>;
}

export default CallbackPage;
