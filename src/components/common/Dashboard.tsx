import { Button } from "@mui/material";
import React from "react";

const Dashboard = () => (
	<Button
		size="small"
		onClick={() => {
			console.log("click");
		}}
		id={`btnUpdateDetails-${process.env.NEXT_PUBLIC_CLIENT_ID}`}
	>
		Update
	</Button>
);
export default Dashboard;
