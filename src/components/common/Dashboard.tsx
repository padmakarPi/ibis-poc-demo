import { useRuntimeEnv } from "@/hooks/customhooks/useRuntimeEnv";
import { Button } from "@mui/material";
import React from "react";

const Dashboard = () => {
	const { NEXT_PUBLIC_CLIENT_ID } = useRuntimeEnv();
	return (
		<Button
			size="small"
			onClick={() => {
				console.log("click");
			}}
			id={`btnUpdateDetails-${NEXT_PUBLIC_CLIENT_ID}`}
		>
			Update
		</Button>
	);
};
export default Dashboard;
