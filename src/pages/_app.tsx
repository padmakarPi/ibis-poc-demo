"use client";

import "@/../public/css/access-control.css";
import { ThemeContextProvider } from "@/components/ThemeComponent/ThemeModeContext";
import Providers from "@/redux/provider";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RootLayout from "../global/layout";
import ErrorFallback from "./ErrorFallback";

export default function MyApp({ Component, pageProps }: AppProps) {
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
			{/* <SecureWrapperProvider> */}
			<Providers>
				{/* <SentrySetUser /> */}
				<ThemeContextProvider>
					{/* <AuthProvider> */}
					<RootLayout>
						<ToastContainer />
						<ErrorBoundary FallbackComponent={ErrorFallback}>
							<Component {...pageProps} />
						</ErrorBoundary>
					</RootLayout>
					{/* </AuthProvider> */}
				</ThemeContextProvider>
			</Providers>
			{/* </SecureWrapperProvider> */}
		</>
	);
}
