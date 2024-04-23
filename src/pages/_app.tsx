import type { AppProps } from "next/app";
import Providers from "@/redux/provider";
import { AuthProvider } from "@/authcontext/AuthContext";
import RootLayout from "../app/layout";

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<AuthProvider>
			<RootLayout>
				<Providers>
					<Component {...pageProps} />
				</Providers>
			</RootLayout>
		</AuthProvider>
	);
}
