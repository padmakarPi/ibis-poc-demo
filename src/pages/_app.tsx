import type { AppProps } from "next/app";
import Providers from "@/redux/provider";
import { AuthProvider } from "@/authcontext/AuthContext";
import RootLayout from "../global/layout";

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Providers>
			<AuthProvider>
				<RootLayout>
					<Component {...pageProps} />
				</RootLayout>
			</AuthProvider>
		</Providers>
	);
}
