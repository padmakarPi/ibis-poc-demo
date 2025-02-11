"use client";

import * as React from "react";
import { useAuth } from "@/hooks/customhooks/useAuth";
import { useEffect, useState } from "react";
import { VSessionExpiredAlertDialog } from "@vplatform/shared-components";
import { SESSION_STORAGE_KEYS } from "@/lib/constant/oidc";
import { getOriginalRoute } from "@/lib/utils";
import { AuthContext } from "@/authcontext/AuthContext";
import { useRouter } from "next/router";
import { ThemeProvider } from "@mui/material";
import { useSelector } from "react-redux";
import { IRootState } from "@/interfaces/states/theme.interfaces";
import { darkTheme, lightTheme } from "@/styles/theme";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sessionExpiredAlertDialogOpen, setSessionExpiredAlertDialogOpen] =
		useState(false);
	const { userManager, login } = useAuth();
	const { getUser } = React.useContext(AuthContext);
	const router = useRouter();
	const isDarkMode = useSelector((state: IRootState) => state.theme.isDarkMode);
	const currentTheme = isDarkMode ? darkTheme : lightTheme;

	useEffect(() => {
		if (!userManager) {
			return;
		}
		userManager.events.addUserSignedOut(async () => {
			await userManager.removeUser();
			setSessionExpiredAlertDialogOpen(true);
		});
	}, [userManager]);

	const onRetry = async () => {
		await login();
	};

	const initializeAuth = async () => {
		try {
			const user = await getUser();
			if (user) {
				const originalRoute = getOriginalRoute();
				router.push(originalRoute);
			} else {
				await login();
			}
			return null;
		} catch {
			return null;
		}
	};

	useEffect(() => {
		const isNotCallbackRoute = !router.asPath.startsWith("/auth/oidc-callback");
		if (isNotCallbackRoute) {
			sessionStorage.setItem(SESSION_STORAGE_KEYS.ORIGINALROUTE, router.asPath);
		}
		if (isNotCallbackRoute) {
			initializeAuth();
		}
	}, []);

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
