"use client";

import { AuthContext } from "@/authcontext/AuthContext";

import useAxiosInterceptor from "@/hooks/customhooks/useAxiosInstance";

import { AuthState } from "@/interfaces/states/auth-state.interface";
import { Box, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { VHandleError } from "@vplatform/shared-components";
import AppbarSidebar from "@/components/microfrontends/AppbarSidebarMicrofrontend";
import { ThemeContext } from "@/components/ThemeComponent/ThemeModeContext";
import { RootState } from "@/redux/store";
import { ISetUserProfile } from "@/interfaces/api/vsecurity.interface";
import { APIURL, DB_TABLES } from "@/lib/constant/api";
import { setDocumentConfig } from "@/redux/reducers/document-config.reducer";
import { setDarkMode } from "@/redux/reducers/dark-mode.reducer";
import { SidebarIcons } from "@/lib/utils";
import {
	selectedOpenPanel,
	setOpenPanel,
} from "@/redux/reducers/applicaiton-config.reducer";
import Dashboard from "../common/Dashboard";

const drawerWidth = 64;

const AppBarHeader = () => {
	const { logout } = useContext(AuthContext);
	const theme: any = useTheme();
	const dispatch = useDispatch();

	const { mode, setMode } = useContext(ThemeContext);

	const authDetails: AuthState = useSelector((state: RootState) => state.auth);

	const [toggleDarkMode, setToggleDarkMode] = useState<boolean | undefined>(
		undefined,
	);
	const openPanelIndex = useSelector(selectedOpenPanel);
	const [name, setName] = useState("VTemplate");

	const { axBe: vdocumentServiceAxios }: any = useAxiosInterceptor(
		process.env.NEXT_PUBLIC_VDOCUMENT_BASE_API_URL,
	);
	const { axBe }: any = useAxiosInterceptor(
		process.env.NEXT_PUBLIC_VSECURITY_BASE_API_URL,
	);

	const setUserProfile = async (data: ISetUserProfile) =>
		axBe
			.post(`${APIURL.SETUSERPROFILE}`, data)
			.catch((error: Error) =>
				VHandleError(error, { service: "set-userpreference" }),
			);
	const handleMode = () => {
		setMode(!mode);
		setToggleDarkMode(!toggleDarkMode);
	};

	useEffect(() => {
		const modeLocal = localStorage.getItem("DarkMode");
		let parsedMode;
		if (modeLocal) {
			parsedMode = JSON.parse(modeLocal);
		} else {
			parsedMode = { DarkMode: false };
		}
		setToggleDarkMode(parsedMode.DarkMode);
	}, []);

	const toggleDarkTheme = async () => {
		const payload = { DarkMode: !mode };
		const themeChangeEvent = new CustomEvent("themeChange", {
			detail: payload,
		});
		document.dispatchEvent(themeChangeEvent);
		await setUserProfile(payload);
		return null;
	};

	const fetchDocumentConfigs = async () => {
		const config = await vdocumentServiceAxios
			.get(APIURL.DOCUMENTCONFIGS, {
				params: { tableName: DB_TABLES.VTICKETING },
			})
			.catch((error: Error) =>
				VHandleError(error, { service: "FetchDocumentConfig" }),
			);
		dispatch(setDocumentConfig(config));
	};

	const getUserProfile = async () => {
		const response = await axBe
			.get(`${APIURL.USERPROFILE}`)
			.catch((error: Error) => VHandleError(error, { service: "UserProfile" }));
		return response;
	};

	useEffect(() => {
		async function fetchDarkMode() {
			try {
				const APIdata = await getUserProfile();
				const isDarkModeActive = APIdata?.data?.result?.darkmode;
				setMode(isDarkModeActive);
				if (isDarkModeActive) {
					setToggleDarkMode(true);
				} else {
					setToggleDarkMode(false);
				}
			} catch (error) {
				console.log("error=", error);
				setMode(false);
				setToggleDarkMode(false);
			}
		}
		fetchDarkMode();
		fetchDocumentConfigs();
	}, []);

	useEffect(() => {
		dispatch(setDarkMode(toggleDarkMode));
	}, [toggleDarkMode, axBe]);

	useEffect(() => {
		setToggleDarkMode(mode);
	}, [mode]);

	useEffect(() => {
		switch (openPanelIndex) {
			case 0:
				setName("Dashboard");
				break;
			case 1:
				setName("V.Link");
				break;
			case 2:
				setName("My Tickets");
				break;
			case 3:
				setName("V.Chat");
				break;
			case 4:
				setName("App Settings");
				break;
			default:
				setName("Default Name");
				break;
		}
	}, [openPanelIndex]);

	const openPage = (index: number) => {
		dispatch(setOpenPanel(index));
	};
	const handleOpenSetting = () => {
		dispatch(setOpenPanel(4));
	};
	return (
		<Box display={"flex"}>
			<Box
				sx={{
					backgroundColor: theme.palette.custom?.headerbgcolor,
					width: "100%",
				}}
			>
				<AppbarSidebar
					visibilityNotificationIcon={false}
					visibilitySettingIcon={false}
					name={name}
					username={authDetails?.authState?.name}
					SidebarIcons={SidebarIcons}
					openPage={openPage}
					handleOpenSetting={handleOpenSetting}
					toggleDarkMode={toggleDarkMode}
					mode={mode}
					toggleDarkTheme={toggleDarkTheme}
					openpanelIndex={openPanelIndex}
					handleLogout={logout}
					handleMode={handleMode}
					mobileComponentvlink={true}
					serviceSearchQuery="?search=Vlink"
					appSettingIndex={4}
				/>

				<Box
					sx={{
						width: { lg: `calc(100% - ${drawerWidth}px)` },
						ml: { lg: `${drawerWidth}px` },
					}}
					marginLeft={{ xs: "0", MobileComponent: "65px", lg: "0" }}
				>
					{(() => {
						switch (openPanelIndex) {
							case 0:
								return <Dashboard />;
							case 1:
								return <Dashboard />;
							default:
								return <Dashboard />;
						}
					})()}
				</Box>
			</Box>
		</Box>
	);
};

export default AppBarHeader;
