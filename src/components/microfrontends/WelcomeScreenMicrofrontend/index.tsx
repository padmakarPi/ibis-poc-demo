import { useMemo } from "react";
import dynamic from "next/dynamic";

const WelcomeScreenMicroFrontEnd = (props: any) => {
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
