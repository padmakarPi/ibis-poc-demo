import { useEffect, useState } from "react";
import { loadRemoteContainer } from "@/lib/utils";
import { useSecureEnv } from "@/context/SecureEnvContext";

const AppbarSidebar = (props: any) => {
	const { NEXT_PUBLIC_APPBAR_URL } = useSecureEnv();
	const [RemoteComponent, setRemoteComponent] = useState<any>(null);

	useEffect(() => {
		let mounted = true;

		async function load() {
			if (!NEXT_PUBLIC_APPBAR_URL) {
				console.warn(
					"Appbar MFE: NEXT_PUBLIC_APPBAR_URL is not set; remoteEntry will not load.",
				);
				return;
			}
			try {
				const remoteUrl = `${NEXT_PUBLIC_APPBAR_URL}_next/static/chunks/remoteEntry.js`;
				const container: any = await loadRemoteContainer("appbar", remoteUrl);
				if (!container?.get) {
					console.error("Appbar MFE: remote container is invalid after load.");
					return;
				}
				const factory = await container.get("./appbarwithsidebar");
				const test = typeof factory === "function" ? factory() : factory;
				if (mounted && test?.default) {
					setRemoteComponent(() => test.default);
				}
			} catch (e) {
				console.error("Appbar MFE: failed to load remoteEntry.js", e);
			}
		}
		load().catch(() => undefined);

		return () => {
			mounted = false;
		};
	}, [NEXT_PUBLIC_APPBAR_URL]);

	if (!RemoteComponent) return null;
	return <RemoteComponent {...props} />;
};

export default AppbarSidebar;
