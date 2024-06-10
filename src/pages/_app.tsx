import type { AppProps } from "next/app";
import Providers from "@/redux/provider";
import { AuthProvider } from "@/authcontext/AuthContext";
import useApplicationAccess from "@/hooks/customhooks/useApplicationAccess";
import RootLayout from "../app/layout";

export default function MyApp({ Component, pageProps }: AppProps) {
	useApplicationAccess();
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
