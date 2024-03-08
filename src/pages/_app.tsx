import type { AppProps } from "next/app";
import Providers from "@/redux/provider";
import Layout from "../app/layout";

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Layout>
			<Providers>
				<Component {...pageProps} />
			</Providers>
		</Layout>
	);
}
