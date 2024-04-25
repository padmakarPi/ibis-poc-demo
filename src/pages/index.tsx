import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/authcontext/AuthContext";

export default function Main() {
	const { getUser, login } = useContext(AuthContext);
	const router = useRouter();
	const initializeAuth = async () => {
		try {
			const user = await getUser();
			if (user) {
				const originalRoute = "/homepage";
				router.push(originalRoute);
				console.log("Successfully login");
			} else {
				login();
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		initializeAuth();
	}, []);
	return <Box>Authentication processing</Box>;
}
