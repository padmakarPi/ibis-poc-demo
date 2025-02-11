"use client";

import type { AppProps } from "next/app";
import Providers from "@/redux/provider";
import { AuthProvider } from "@/authcontext/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ErrorBoundary } from "react-error-boundary";
import { ThemeContextProvider } from "@/components/ThemeComponent/ThemeModeContext";
import ErrorFallback from "./ErrorFallback";
import RootLayout from "../global/layout";

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
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
