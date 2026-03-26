"use client";

import WelcomeScreenMicroFrontEnd from "@/components/microfrontends/WelcomeScreenMicrofrontend";

export default function Main() {
	console.log("Main");
	return <WelcomeScreenMicroFrontEnd currentStep={0} IsCallBackPage={false} />;
}
