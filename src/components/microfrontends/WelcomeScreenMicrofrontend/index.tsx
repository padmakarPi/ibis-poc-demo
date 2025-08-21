import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRuntimeEnv } from "@/hooks/customhooks/useRuntimeEnv";
import { loadRemoteContainer } from "@/lib/utils";

const WelcomeScreenMicroFrontEnd = (props: any) => {
	const { NEXT_PUBLIC_WELCOME_APP_MICROFRONTEND_BASE_URL } = useRuntimeEnv();
	useEffect(() => {
		async function load() {
			const remoteUrl = `${NEXT_PUBLIC_WELCOME_APP_MICROFRONTEND_BASE_URL}_next/static/chunks/remoteEntry.js`;
			await loadRemoteContainer("VWelcomeApp", remoteUrl);
		}
		load();
	}, []);
	const WelcomeScreenMemo = useMemo(
		() =>
			dynamic<any>(() => import("VWelcomeApp/welcome-screen"), {
				ssr: false,
			}),
		[],
	);
	return <WelcomeScreenMemo {...props} />;
};

export default WelcomeScreenMicroFrontEnd;
