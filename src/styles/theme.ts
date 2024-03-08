"use client";

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
		MuiAppBar: {
			styleOverrides: {
				colorPrimary: {
					backgroundColor: "#052e2b",
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					color: "white",
					backgroundColor: "#68DA6A",
					"&:hover": {
						backgroundColor: "#68DA6A",
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
		MuiBadge: {
			styleOverrides: {
				badge: {
					backgroundColor: "#68da6a",
					color: "#68da6a",
					borderColor: "#052e2b",
				},
			},
		},
		MuiAvatar: {
			styleOverrides: {
				root: {
					backgroundColor: "#B2DFDB",
					color: "#004D40",
				},
			},
		},
	},
	typography: {
		fontFamily: "Inter, sans-serif",
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
		MuiBadge: {
			styleOverrides: {
				badge: {
					backgroundColor: "#68da6a",
					color: "#68da6a",
					borderColor: "red",
				},
			},
		},
	},
});
