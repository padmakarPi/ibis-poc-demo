"use client";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import AppBar from "@mui/material/AppBar";
import Image from "next/image";
import { Badge, ListItemIcon } from "@mui/material";
import { useState } from "react";
import Switch from "@mui/material/Switch";
import { FlexBox } from "@/styles/mui/dashboard.styled";
import { INavBarProps } from "@/interfaces/states/theme.interfaces";

const NavBar = ({ isDarkMode, toggleTheme }: INavBarProps) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const label = { inputProps: { "aria-label": "Switch demo" } };
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	return (
		<AppBar position="static" color="primary" data-testid="navbar">
			<Toolbar>
				<IconButton
					size="large"
					edge="start"
					color="inherit"
					aria-label="menu"
					sx={{ mr: 2 }}
				>
					<Image src="/svg/dashboard.svg" alt="" width={32} height={32} />
				</IconButton>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					Control Panel
				</Typography>
				<FlexBox>
					<Typography
						variant="h6"
						component="div"
						sx={{ display: { xs: "none", sm: "block" } }}
					>
						Borderforce
					</Typography>

					<IconButton
						size="large"
						aria-label="account of current user"
						aria-controls="menu-appbar"
						aria-haspopup="true"
						onClick={handleMenu}
					>
						<Badge
							overlap="circular"
							anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
							variant="dot"
						>
							<Avatar>SG</Avatar>
						</Badge>
					</IconButton>
					<Menu
						id="menu-appbar"
						anchorEl={anchorEl}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "right",
						}}
						keepMounted
						transformOrigin={{
							vertical: "top",
							horizontal: "right",
						}}
						open={Boolean(anchorEl)}
						onClose={handleClose}
					>
						<MenuItem>
							<ListItemIcon>
								<Switch
									data-testid="theme-toggler"
									{...label}
									checked={isDarkMode}
									onClick={toggleTheme}
								/>
							</ListItemIcon>
							<Typography variant="inherit">Light Theme</Typography>
						</MenuItem>
						<MenuItem>
							<ListItemIcon>
								<AccountCircleIcon fontSize="small" />
							</ListItemIcon>
							<Typography variant="inherit">Manage Profile</Typography>
						</MenuItem>
						<MenuItem onClick={handleClose}>
							<ListItemIcon>
								<LogoutIcon fontSize="small" />
							</ListItemIcon>
							<Typography variant="inherit">Logout</Typography>
						</MenuItem>
					</Menu>
				</FlexBox>
			</Toolbar>
		</AppBar>
	);
};

export default NavBar;
