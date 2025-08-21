import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import { SESSION_STORAGE_KEYS } from "./constant/oidc";

export const SidebarIcons = [
	{
		icon: <DashboardIcon sx={{ width: "24px !important" }} />,
		name: "DASH",
		title: "Dashboard",
	},
	{
		icon: <ConfirmationNumberIcon sx={{ width: "24px !important" }} />,
		name: "TICKETS",
		title: "Tickets",
	},
	{
		icon: <LiveHelpIcon sx={{ width: "24px !important" }} />,
		name: "MY TICKETS",
		title: "My Tickets",
	},
	{
		icon: <ChatIcon sx={{ width: "24px !important" }} />,
		name: "VCHAT",
		title: "V.Chat",
	},
];

export function getOriginalRoute() {
	let originalRoute = sessionStorage.getItem(
		SESSION_STORAGE_KEYS.ORIGINALROUTE,
	);

	if (!originalRoute || originalRoute === "/") {
		originalRoute = "/dashboard";
	}
	return originalRoute;
}

export async function loadRemoteContainer(remoteName: string, url: string) {
	await new Promise<void>((resolve, reject) => {
		const script = document.createElement("script");
		script.src = url;
		script.type = "text/javascript";
		script.async = true;
		script.onload = () => resolve();
		script.onerror = reject;
		document.head.appendChild(script);
	});

	return window[remoteName];
}
