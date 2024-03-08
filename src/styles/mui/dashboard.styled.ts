import styled from "styled-components";
import { createTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

const theme = createTheme({
	components: {
		MuiBadge: {
			styleOverrides: {
				badge: {
					width: "12px",
					height: "12px",
					borderRadius: "64px",

					border: "2px solid #052e2b",
				},
			},
		},
		MuiAvatar: {
			styleOverrides: {
				root: {
					width: "32px",
					height: "32px",
					fontSize: "16px",
					fontWeight: "500",
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					color: "#000000",
					borderRadius: "4px",
					fontSize: "1rem",
				},
				contained: {
					boxShadow: "none",
				},
			},
		},
	},
});
const TextInput = styled.input`
	position: relative;
	align-items: center;
	background-color: #052e2b;
	width: 100%;
	height: 100%;
	outline: none;
	color: white;
	border: 0;
	font-size: 0.875rem;
`;
const GreenBox = styled(Box)`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	height: 140px;
	background-color: #052e2b;
	border-top: 1px solid rgba(255, 255, 255, 0.5);
	@media (max-width: 600px) {
		height: 64px;
	}
`;
const FlexBox = styled(Box)`
	display: flex;
	align-items: center;
	line-height: 32px;
`;
const FlexBoxContent = styled(Box)`
	width: 100%;
	position: relative;
	display: flex;
	justify-content: space-between;
	padding-left: 7.375rem;
	padding-right: 7.375rem;
	@media (max-width: 960px) {
		padding-left: 1.8rem;
		padding-right: 1.8rem;
	}

	@media (max-width: 600px) {
		padding-left: 1.3rem;
		padding-right: 1.3rem;
	}
`;

const VFlexBox = styled(Box)`
	width: 100%;
	position: relative;
	display: flex;
	justify-content: space-between;
	padding-left: 7.375rem;
	padding-right: 7.375rem;
	background-color: #f5f5f5;
	height: 100vh;
	overflow-x: hidden;
	padding-top: 20px;
	@media (max-width: 960px) {
		padding-left: 1.8rem;
		padding-right: 1.8rem;
	}

	@media (max-width: 600px) {
		padding-left: 1.3rem;
		padding-right: 1.3rem;
	}
`;
const InputBox = styled(Box)`
	color: white;
	align-items: center;
	width: 380px;
	height: 36px;
	background-color: #052e2b;
	border: 1px solid rgba(255, 255, 255, 0.5);
	border-radius: 4px;
	padding: 0px 12px 0px 12px;
	display: flex;
	@media (max-width: 600px) {
		width: 281px;
	}
`;
const AddIconButton = styled(Box)`
	display: flex;
	position: relative;
	width: 34px;
	height: 34px;
	background-color: #68da6a;
	color: #000000;
	border-radius: 4px;
	justify-content: center;
	align-items: center;
`;
const Vuser = styled(Box)`
	margin: 17px 7px 7px 3px;
	display: flex;
	padding: var(--2, 1rem) var(--3, 1.5rem);
	align-items: flex-start;
	gap: 0.9375rem;
	box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
	height: 100%;
	border-radius: 4px;
	background-color: #fdfdfd;
	&:hover {
		transform: translateY(-5px);
		box-shadow: 0px 10px 20px 2px rgba(0, 0, 0, 0.25);
	}
`;

export {
	theme,
	FlexBox,
	GreenBox,
	TextInput,
	InputBox,
	FlexBoxContent,
	AddIconButton,
	VFlexBox,
	Vuser,
};
