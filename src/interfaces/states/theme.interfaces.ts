import type { Theme } from "@mui/material/styles";

export interface IThemeState {
	isDarkMode: boolean;
}
export interface INavBarProps {
	isDarkMode: boolean;
	toggleTheme: () => void;
	currentTheme: Theme;
}
export interface IRootState {
	theme: {
		isDarkMode: boolean;
	};
}
