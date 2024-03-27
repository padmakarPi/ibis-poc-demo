import type { AppProps } from "next/app";
import Providers from "@/redux/provider";
import { useRouter } from "next/router";
import { useEffect } from "react";
import RootLayout from "../app/layout";

export default function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();

	useEffect(() => {
		if (!router.asPath.startsWith("/auth/oidc-callback")) {
			localStorage.setItem("originalRoute", router.asPath);
		}
	}, []);

	return (
		<RootLayout>
			<Providers>
				<Component {...pageProps} />
			</Providers>
		</RootLayout>
	);
}
