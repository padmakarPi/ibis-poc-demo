"use client";

import type { AppProps } from "next/app";
import Providers from "@/redux/provider";
import { AuthProvider } from "@/authcontext/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ErrorBoundary } from "react-error-boundary";
import Head from "next/head";
import { ThemeContextProvider } from "@/components/ThemeComponent/ThemeModeContext";
import ErrorFallback from "./ErrorFallback";
import RootLayout from "../global/layout";

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
				/>
				<meta charSet="UTF-8" />
				<meta name="description" content="VTemplate" />
				<meta name="keywords" content="VTemplate" />
				<meta name="author" content="VTemplate" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content="VTemplate" />
				<meta name="description" content="VTemplate" />
				<meta name="format-detection" content="telephone=no" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="msapplication-tap-highlight" content="no" />
				<title>V.Template</title>
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
					rel="stylesheet"
					as="style"
				/>
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
