"use client";

import * as React from "react";
import { useAuth } from "@/hooks/customhooks/useAuth";
import { useEffect, useState } from "react";
import { VSessionExpiredAlertDialog } from "@vplatform/core";
import { AuthContext } from "@/authcontext/AuthContext";
import { usePathname } from "next/navigation";
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
	const [sessionExpiredAlertDialogOpen, setSessionExpiredAlertDialogOpen] =
		useState(false);
	const { userManager, login } = useAuth();
	const { getUser } = React.useContext(AuthContext);
	const pathname = usePathname();
	const isDarkMode = useSelector((state: IRootState) => state.theme.isDarkMode);
	const currentTheme = isDarkMode ? darkTheme : lightTheme;

	const onRetry = async () => {
		await login();
	};

	const initializeAuth = async () => {
		try {
			const user = await getUser();
			if (user) {
				return null;
			} 
				await login();
			
			return null;
		} catch {
			return null;
		}
	};

	useEffect(() => {
		if (pathname.startsWith("/auth/oidc-callback")) {
			console.log("Skipping initializeAuth during OIDC callback");
			return;
		}

		initializeAuth();
	}, [pathname]);

	useEffect(() => {
		const attachSignedOutListener = async () => {
			const user = await getUser();
			if (!user) return;

			userManager?.events.addUserSignedOut(async () => {
				console.log("OIDC: user signed out");
				await userManager.removeUser();
				setSessionExpiredAlertDialogOpen(true);
			});
		};

		attachSignedOutListener();
	}, [userManager]);
	useDynamicCss();

	return (
		<>
			<ThemeProvider theme={currentTheme}>
				<main>{children}</main>
				<VSessionExpiredAlertDialog
					open={sessionExpiredAlertDialogOpen}
					setOpen={setSessionExpiredAlertDialogOpen}
					onRetry={onRetry}
				/>
			</ThemeProvider>
		</>
	);
}
