"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Box, Button, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import useMediaQuery from "@mui/material/useMediaQuery";
import { VHandleError } from "@vplatform/shared-components";
import axios from "axios";

import {
	AddIconButton,
	FlexBoxContent,
	GreenBox,
	InputBox,
	TextInput,
	VFlexBox,
} from "../styles/mui/dashboard.styled";
import VDetails from "./common/VDetails";

const Dashboard = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		console.log("event", event.target.value);
		setSearchQuery(event.target.value);
	};

	useEffect(() => {
		async function fetchUrl() {
			await axios
				.get("https://jsonplceholder.typicode.com/todos")
				.catch(err => VHandleError(err, { customMessage: "testing" }));
		}
		fetchUrl();
	}, []);

	return (
		<Box data-testid="dashboard">
			<GreenBox>
				<Image width={22} height={22} src="/images/Corner.png" alt="" />
				<FlexBoxContent>
					<InputBox>
						<TextInput
							type="text"
							placeholder="Search Setting"
							value={searchQuery}
							onChange={handleInputChange}
						/>
						<SearchIcon />
					</InputBox>

					{isSmallScreen ? (
						<AddIconButton>
							<AddIcon sx={{ width: "1rem", height: "1rem" }} />
						</AddIconButton>
					) : (
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							endIcon={<ArrowDropDownIcon />}
						>
							CREATE NEW
						</Button>
					)}
				</FlexBoxContent>
			</GreenBox>
			<VFlexBox>
				<VDetails />
			</VFlexBox>
		</Box>
	);
};

export default Dashboard;
