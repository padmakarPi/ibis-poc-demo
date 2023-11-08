import { createTheme } from "@mui/material/styles";

// Light Mode Theme
export const lightTheme = createTheme({
	palette: {
		mode: "light",
		background: {
			default: "white",
		},
		primary: {
			main: "#1976D2",
		},
		secondary: {
			main: "#f50057",
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					color: "white",
					backgroundColor: "#1976D2",
					"&:hover": {
						backgroundColor: "#135ca3",
					},
				},
			},
		},
		MuiTable: {
			styleOverrides: {
				root: {
					color: "black",
					backgroundColor: "white",
					"&:hover": {
						backgroundColor: "white",
					},
				},
			},
		},
		MuiContainer: {
			styleOverrides: {
				root: {
					color: "black",
					backgroundColor: "white",
				},
			},
		},
	},
});

// Dark Mode Theme
export const darkTheme = createTheme({
	palette: {
		mode: "dark",
		background: {
			default: "black",
		},
		primary: {
			main: "#90caf9",
		},
		secondary: {
			main: "#f48fb1",
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					color: "white",
					backgroundColor: "#90caf9",
					"&:hover": {
						backgroundColor: "#6b9bc2",
					},
				},
			},
		},
		MuiTable: {
			styleOverrides: {
				root: {
					color: "white",
					backgroundColor: "#211f1f",
					"&:hover": {
						backgroundColor: "#211f1f",
					},
				},
			},
		},
		MuiContainer: {
			styleOverrides: {
				root: {
					color: "white",
					backgroundColor: "black",
				},
			},
		},
	},
});
