import { AVATAR_BG_COLORS, AVATAR_BG_COLORS_LIGHT } from "./avatar";

export const getColors = (index: number) => {
	const colorIndex = index % AVATAR_BG_COLORS_LIGHT.length;
	return AVATAR_BG_COLORS_LIGHT[colorIndex];
};

export const getRandomAvatarBackground = () => {
	const randomIndex = Math.floor(Math.random() * AVATAR_BG_COLORS_LIGHT.length);
	return AVATAR_BG_COLORS_LIGHT[randomIndex];
};

export const getColorsWithTheme = (theme: string) => {
	const themeColors = AVATAR_BG_COLORS[theme];
	const randomIndex = Math.floor(Math.random() * themeColors.length);
	return themeColors[randomIndex];
};
