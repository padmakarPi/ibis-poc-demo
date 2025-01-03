"use client";

import { ThemeProvider } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "@/styles/theme";
import { IRootState } from "@/interfaces/states/theme.interfaces";
import AppBarHeader from "../../components/appbar";

const Home = () => {
	const isDarkMode = useSelector((state: IRootState) => state.theme.isDarkMode);

	const currentTheme = isDarkMode ? darkTheme : lightTheme;

	return (
		<>
			<ThemeProvider theme={currentTheme}>
				<AppBarHeader />
			</ThemeProvider>
		</>
	);
};

export default Home;
