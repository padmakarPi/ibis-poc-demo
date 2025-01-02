import { ThemeProvider } from "@mui/material";
import { useContext } from "react";
import { darkTheme, lightTheme } from "../../styles/theme";
import { ThemeContext } from "./ThemeModeContext";

export const ThemeComponent = ({ children }: { children: React.ReactNode }) => {
	const { mode } = useContext(ThemeContext);
	return (
		<ThemeProvider theme={mode ? darkTheme : lightTheme}>
			{children}
		</ThemeProvider>
	);
};
