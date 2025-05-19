"use client";

import Head from "next/head";
import type { AppProps } from "next/app";
import Providers from "@/redux/provider";
import { AuthProvider } from "@/authcontext/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ErrorBoundary } from "react-error-boundary";
import { ThemeContextProvider } from "@/components/ThemeComponent/ThemeModeContext";
import { useEffect } from "react";
import { useDynamicCss } from "@/hooks/customhooks/useComponentAccess";
import ErrorFallback from "./ErrorFallback";
import RootLayout from "../global/layout";
import "@/../public/css/access-control.css";

export default function MyApp({ Component, pageProps }: AppProps) {
	useDynamicCss();

	useEffect(() => {
		const preventDefault = (event: any) => {
			event.preventDefault();
		};

		document.addEventListener("dragover", preventDefault);
		document.addEventListener("drop", preventDefault);
		return () => {
			document.removeEventListener("dragover", preventDefault);
			document.removeEventListener("drop", preventDefault);
		};
	}, []);

	return (
		<>
			<Head>
				<title>V.Template</title>
			</Head>
			<Providers>
				<ThemeContextProvider>
					<AuthProvider>
						<RootLayout>
							<ToastContainer />
							<ErrorBoundary FallbackComponent={ErrorFallback}>
								<Component {...pageProps} />
							</ErrorBoundary>
						</RootLayout>
					</AuthProvider>
				</ThemeContextProvider>
			</Providers>
		</>
	);
}
