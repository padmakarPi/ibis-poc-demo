import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRuntimeEnv } from "@/hooks/customhooks/useRuntimeEnv";
import { loadRemoteContainer } from "@/lib/utils";

const AppbarSidebar = (props: any) => {
	const { NEXT_PUBLIC_APPBAR } = useRuntimeEnv();
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
