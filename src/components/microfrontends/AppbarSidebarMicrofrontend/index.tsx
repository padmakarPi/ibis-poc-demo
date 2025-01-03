import { useMemo } from "react";
import dynamic from "next/dynamic";

const AppbarSidebar = (props: any) => {
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
