import { useEffect, useState } from "react";
import { loadRemoteContainer } from "@/lib/utils";
import { useSecureEnv } from "@/context/SecureEnvContext";

const WelcomeScreenMicroFrontEnd = (props: any) => {
	const { NEXT_PUBLIC_WELCOME_APP_MICROFRONTEND_BASE_URL } = useSecureEnv();
	const [RemoteComponent, setRemoteComponent] = useState<any>(null);

	useEffect(() => {
		let mounted = true;

		async function load() {
			if (!NEXT_PUBLIC_WELCOME_APP_MICROFRONTEND_BASE_URL) {
				console.warn(
					"Welcome MFE: NEXT_PUBLIC_WELCOME_APP_MICROFRONTEND_BASE_URL is not set; remoteEntry will not load.",
				);
				return;
			}
			try {
				const remoteUrl = `${NEXT_PUBLIC_WELCOME_APP_MICROFRONTEND_BASE_URL}_next/static/chunks/remoteEntry.js`;
				const container: any = await loadRemoteContainer(
					"VWelcomeApp",
					remoteUrl,
				);
				if (!container?.get) {
					console.error("Welcome MFE: remote container is invalid after load.");
					return;
				}
				const factory = await container.get("./welcome-screen");
				const Module = typeof factory === "function" ? factory() : factory;
				if (mounted && Module?.default) {
					setRemoteComponent(() => Module.default);
				}
			} catch (e) {
				console.error("Welcome MFE: failed to load remoteEntry.js", e);
			}
		}
		load().catch(() => undefined);

		return () => {
			mounted = false;
		};
	}, [NEXT_PUBLIC_WELCOME_APP_MICROFRONTEND_BASE_URL]);

	if (!RemoteComponent) return null;
	return <RemoteComponent {...props} />;
};

export default WelcomeScreenMicroFrontEnd;
