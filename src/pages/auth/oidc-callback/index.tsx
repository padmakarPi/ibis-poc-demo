import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/authcontext/AuthContext";
import { useDispatch } from "react-redux";
import { setAuthState } from "@/redux/slices/authslice";
import Cookies from "js-cookie";

function CallbackPage() {
	const router = useRouter();
	const { getUser, saveToken, userManager } = useContext(AuthContext);
	const dispatch = useDispatch();
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
			userManager.signinRedirectCallback().then(() => {
				getUserData();
			});
		}
	}, [userManager]);

	return <div>Processing OIDC callback...</div>;
}

export default CallbackPage;
