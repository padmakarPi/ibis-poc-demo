import { getColorsWithTheme } from "@/lib/config/avatar-colors";
import { createContext, useEffect, useState } from "react";

interface ColorCode {
	backgroundColor: string;
	color: string;
	textColor: string;
}
interface ThemeContextProps {
	mode: boolean;
	setMode: (mode: boolean) => void;
	profileColor: (userId: number) => ColorCode;
}

interface UserColorType {
	[key: string]: { [contactId: number]: ColorCode };
}
export const ThemeContext = createContext<ThemeContextProps>({
	mode: false,
	setMode: () => {},
	profileColor: (): ColorCode => ({}) as ColorCode,
});

export const ThemeContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const modeLocal =
		typeof window !== "undefined" && localStorage.getItem("DarkMode");
	let parsedMode;
	if (modeLocal) {
		parsedMode = JSON.parse(modeLocal);
	} else {
		parsedMode = { DarkMode: false };
	}
	const [mode, setMode] = useState<boolean>(parsedMode.DarkMode);

	const [userColor, setUserColor] = useState<UserColorType>({});

	useEffect(() => {
		localStorage.setItem("userColor", JSON.stringify(userColor));
	}, [userColor]);

	const profileColor = (contactId: number) => {
		const modeName = mode ? "dark" : "light";

		if (userColor && userColor[modeName] && userColor[modeName][contactId]) {
			return userColor[modeName][contactId];
		}

		if (!userColor[modeName]) {
			userColor[modeName] = {};
			setUserColor(prev => ({
				...prev,
				[modeName]: {},
			}));
		}

		const { backgroundColor, color, textColor } = getColorsWithTheme(
			mode ? "dark" : "light",
		);

		const pColor = {
			backgroundColor,
			color,
			textColor,
		};
		setUserColor(prev => ({
			...prev,
			[modeName]: {
				...prev[modeName],
				[contactId]: pColor,
			},
		}));
		return pColor;
	};

	return (
		<ThemeContext.Provider value={{ mode, setMode, profileColor }}>
			{children}
		</ThemeContext.Provider>
	);
};
