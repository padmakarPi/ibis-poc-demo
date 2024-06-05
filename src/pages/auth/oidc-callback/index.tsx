import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/authcontext/AuthContext";

function CallbackPage() {
	const router = useRouter();
	const { getUser, saveToken, userManager } = useContext(AuthContext);
	const getUserData = async () => {
		const userData = await getUser();
		if (userData && userData.profile && userData.profile.email) {
			saveToken(userData);
			const originalRoute = "/homepage";
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
