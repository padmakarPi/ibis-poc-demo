"use client";

import * as React from "react";
import { ThemeProvider } from "@mui/material";
import { useSelector } from "react-redux";
import { IRootState } from "@/interfaces/states/theme.interfaces";
import { darkTheme, lightTheme } from "@/styles/theme";
import "./globals.css";
import { useDynamicCss } from "@/hooks/customhooks/useComponentAccess";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const isDarkMode = useSelector((state: IRootState) => state.theme.isDarkMode);
	const currentTheme = isDarkMode ? darkTheme : lightTheme;

	useDynamicCss();

	return (
		<ThemeProvider theme={currentTheme}>
			<main>{children}</main>
		</ThemeProvider>
	);
}
