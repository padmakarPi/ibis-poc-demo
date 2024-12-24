"use client";

import type { AppProps } from "next/app";
import Providers from "@/redux/provider";
import { AuthProvider } from "@/authcontext/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RootLayout from "../global/layout";

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Providers>
			<AuthProvider>
				<RootLayout>
					<ToastContainer />
					<Component {...pageProps} />
				</RootLayout>
			</AuthProvider>
		</Providers>
	);
}
