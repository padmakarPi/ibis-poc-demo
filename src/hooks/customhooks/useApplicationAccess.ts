/* eslint-disable consistent-return */
import { useEffect } from "react";
import { useRouter } from "next/router";
import { SECURITY } from "@/lib/constant/apiconstant";
import useAxiosInterceptor from "./useAxiosInstance";

const useApplicationAccess = () => {
	const router = useRouter();
	const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || "";
	const { axBe }: any = useAxiosInterceptor(
		process.env.NEXT_PUBLIC_VSECURITY_BASE_API_URL,
	);

	useEffect(() => {
		if (
			router.pathname.startsWith("/auth") ||
			router.pathname === "/" ||
			router.pathname === "/health/ready"
		) {
			return;
		}
		const checkApplicationAccess = async () => {
			try {
				const res = await axBe.get(
					`${SECURITY.CHECKAPPLICATIONACCESS}?clientId=${clientId}`,
				);
				if (!res.data.result) {
					router.push(
						`${process.env.NEXT_PUBLIC_STS_AUTHORITY}/Account/AccessDenied`,
					);
				}
				console.log("access", res.data.result);
			} catch (error) {
				console.error("Error checking application access:", error);
			}
		};

		checkApplicationAccess();
	}, [router, clientId]);
};

export default useApplicationAccess;
