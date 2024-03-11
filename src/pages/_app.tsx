import type { AppProps } from "next/app";
import Providers from "@/redux/provider";
import RootLayout from "../app/layout";

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<RootLayout>
			<Providers>
				<Component {...pageProps} />
			</Providers>
		</RootLayout>
	);
}
