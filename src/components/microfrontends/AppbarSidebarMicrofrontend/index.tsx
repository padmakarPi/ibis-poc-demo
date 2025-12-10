import { useEffect, useState } from "react";
import { loadRemoteContainer } from "@/lib/utils";
import { useSecureEnv } from "@/context/SecureEnvContext";

const AppbarSidebar = (props: any) => {
	const { NEXT_PUBLIC_APPBAR_URL } = useSecureEnv();
	const [RemoteComponent, setRemoteComponent] = useState<any>(null);

	useEffect(() => {
		let mounted = true;

		async function load() {
			const remoteUrl = `${NEXT_PUBLIC_APPBAR_URL}_next/static/chunks/remoteEntry.js`;
			const container: any = await loadRemoteContainer("appbar", remoteUrl);
			const factory = await container.get("./appbarwithsidebar");
			const test = factory();
			if (mounted) {
				setRemoteComponent(() => test.default);
			}
		}
		load();

		return () => {
			mounted = false;
		};
	}, [NEXT_PUBLIC_APPBAR_URL]);

	if (!RemoteComponent) return null;
	return <RemoteComponent {...props} />;
};

export default AppbarSidebar;
