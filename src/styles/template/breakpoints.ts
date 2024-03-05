import * as breakpointsData from "../../../public/json/breakpoint.json";

const getBreakpoints = (breakpoint: string) => {
	const variableData = breakpointsData.variables.find(
		variable => variable.name === breakpoint,
	);
	if (variableData) {
		return variableData.valuesByMode["833:0"];
	}

	return null;
};
export const xl = `${getBreakpoints("xl")}px`;
export const lg = `${getBreakpoints("lg")}px`;
export const md = `${getBreakpoints("md")}px`;
export const sm = `${getBreakpoints("sm")}px`;
