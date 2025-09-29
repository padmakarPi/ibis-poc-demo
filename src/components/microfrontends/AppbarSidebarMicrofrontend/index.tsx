import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { loadRemoteContainer } from "@/lib/utils";
import { useSecureEnv } from "@/context/SecureEnvContext";

const AppbarSidebar = (props: any) => {
	const { NEXT_PUBLIC_APPBAR } = useSecureEnv();
	useEffect(() => {
		async function load() {
			const remoteUrl = `${NEXT_PUBLIC_APPBAR}_next/static/chunks/remoteEntry.js`;
			await loadRemoteContainer("appbar", remoteUrl);
		}
		load();
	}, []);
	const AppbarWithSidebar = useMemo(
		() =>
			dynamic<any>(() => import("appbar/appbarwithsidebar"), {
				ssr: false,
			}),
		[],
	);

	return <AppbarWithSidebar {...props} />;
};

export default AppbarSidebar;
