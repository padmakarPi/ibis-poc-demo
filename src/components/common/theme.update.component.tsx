import React from "react";
import { MaterialUISwitch } from "@/styles/MUI/theme-switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

interface IThemeTogglerProps {
	isDarkMode: boolean;
	setIsDarkMode: any;
}

const ThemeToggler: React.FC<IThemeTogglerProps> = ({
	isDarkMode,
	setIsDarkMode,
}: IThemeTogglerProps) => {
	const toggleTheme = () => {
		setIsDarkMode(!isDarkMode);
	};

	return (
		<div style={{ display: "flex", justifyContent: "flex-end" }}>
			<FormGroup>
				<FormControlLabel
					control={
						<MaterialUISwitch
							sx={{ m: 1 }}
							checked={isDarkMode}
							onChange={toggleTheme}
						/>
					}
					label="Change Mode"
				/>
			</FormGroup>
		</div>
	);
};

export default ThemeToggler;
