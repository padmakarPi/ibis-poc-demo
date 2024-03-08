import data from "../../../public/json/colorpalette.json";

const colorPaletteData = data[0].palette.modes.Light;

const primaryMain = colorPaletteData.primary.main.$value;
const secondaryMain = colorPaletteData.secondary.main.$value;
const successMain = colorPaletteData.success.main.$value;

export { primaryMain, secondaryMain, successMain };
