import * as React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

export default function health() {
	return (
		<Box
			sx={{
				justifyContent: "center",
				display: "flex",
				alignItems: "center",
				marginTop: "40px",
			}}
		>
			<Card
				sx={{
					width: "400px",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					paddingTop: "40px",
					paddingBottom: "40px",
					boxShadow:
						"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
				}}
			>
				<Box>
					<Typography
						gutterBottom
						variant="h5"
						component="div"
						sx={{ display: "flex", justifyContent: "center" }}
					>
						Status: Healthy
					</Typography>

					<Typography
						gutterBottom
						variant="h6"
						component="div"
						marginTop={"20px"}
					>
						Ready: Service is up and running!
					</Typography>
				</Box>
			</Card>
		</Box>
	);
}
