import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import { useEffect } from "react";
import AuthService from "@/services/auth.service";

export default function Main() {
	const router = useRouter();
	const authService = new AuthService();

	useEffect(() => {
		(async () => {
			try {
				const user = await authService.getUser();

				if (user) {
					let originalRoute = localStorage.getItem("originalRoute");

					if (!originalRoute || originalRoute === "/") {
						originalRoute = "/homepage";
					}

					router.push(originalRoute);
				} else {
					await authService.login();
				}
			} catch (error) {
				/* empty */
			}
		})();
	}, []);

	return <Box>Authentication processing</Box>;
}
