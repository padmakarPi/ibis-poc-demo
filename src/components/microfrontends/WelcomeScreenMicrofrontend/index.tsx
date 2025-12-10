import { useEffect, useState } from "react";
import { loadRemoteContainer } from "@/lib/utils";
import { useSecureEnv } from "@/context/SecureEnvContext";

const WelcomeScreenMicroFrontEnd = (props: any) => {
	const { NEXT_PUBLIC_WELCOME_APP_MICROFRONTEND_BASE_URL } = useSecureEnv();
	const [RemoteComponent, setRemoteComponent] = useState<any>(null);

	useEffect(() => {
		let mounted = true;

		async function load() {
			const remoteUrl = `${NEXT_PUBLIC_WELCOME_APP_MICROFRONTEND_BASE_URL}_next/static/chunks/remoteEntry.js`;
			const container: any = await loadRemoteContainer(
				"VWelcomeApp",
				remoteUrl,
			);
			const factory = await container.get("./welcome-screen");
			const Module = factory();
			if (mounted) {
				setRemoteComponent(() => Module.default);
			}
		}
		load();

		return () => {
			mounted = false;
		};
	}, [NEXT_PUBLIC_WELCOME_APP_MICROFRONTEND_BASE_URL]);

	if (!RemoteComponent) return null;
	return <RemoteComponent {...props} />;
};

export default WelcomeScreenMicroFrontEnd;
