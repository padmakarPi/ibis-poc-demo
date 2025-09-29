import { useSecureEnv } from "@/context/SecureEnvContext";
import { Button } from "@mui/material";
import React from "react";

const Dashboard = () => {
	const { NEXT_PUBLIC_CLIENT_ID } = useSecureEnv();
	return (
		<Button
			size="small"
			onClick={() => {}}
			id={`btnUpdateDetails-${NEXT_PUBLIC_CLIENT_ID}`}
		>
			Update
		</Button>
	);
};
export default Dashboard;
