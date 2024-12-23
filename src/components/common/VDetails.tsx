import Box from "@mui/material/Box";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { Avatar, Grid, IconButton, styled, Typography } from "@mui/material";
import { FlexBox } from "../../styles/mui/dashboard.styled";

const Item = styled("div")(() => ({
	backgroundColor: "#FDFDFD",
	padding: "2px 3px 2px 3px",
	borderRadius: "4px",

	transition: "all ease 0.2s",
	boxShadow:
		"0px 2px 4px -1px rgba(0, 0, 0, 0.20), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)",
	"&:hover": {
		boxShadow: "0px 5px 5px 0px rgba(65, 63, 63, 0.5)",
		backgroundColor: "rgba(232, 245, 233, 0.12)",
	},
}));
const VDetails = () => (
	<Box sx={{ flexGrow: 1 }}>
		<Grid
			container
			spacing={{ xs: 2, md: 3 }}
			columns={{ xs: 1, sm: 2, md: 6 }}
		>
			{Array.from(Array(6)).map((_, index) => (
				<Grid xs={1} sm={1} md={2} key={index}>
					<Item>
						<FlexBox>
							<IconButton
								size="large"
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
							>
								<Avatar sx={{ width: "64px", height: "64px" }}>
									<PersonOutlineOutlinedIcon sx={{ width: 48, height: 48 }} />
								</Avatar>
							</IconButton>
							<Box>
								<Typography
									variant="h6"
									component="div"
									style={{ color: "#00704B" }}
								>
									V.Users
								</Typography>
								<Typography variant="body2">
									User management, authorization & authentication
								</Typography>
							</Box>
						</FlexBox>
					</Item>
				</Grid>
			))}
		</Grid>
	</Box>
);

export default VDetails;
