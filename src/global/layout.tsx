"use client";

import { useAuth } from "@/hooks/customhooks/useAuth";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { VSessionExpiredAlertDialog } from "@vplatform/shared-components";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sessionExpiredAlertDialogOpen, setSessionExpiredAlertDialogOpen] =
		useState(false);
	const { userManager, login } = useAuth();

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

	return (
		<>
			<main className={inter.className}>{children}</main>
			<VSessionExpiredAlertDialog
				open={sessionExpiredAlertDialogOpen}
				setOpen={setSessionExpiredAlertDialogOpen}
				onRetry={onRetry}
			/>
		</>
	);
}
