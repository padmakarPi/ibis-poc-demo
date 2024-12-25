const depcheck = require("depcheck");
const { IgnorePlugin } = require("webpack");

const options = {
	ignoreMissing: true,
	ignoreBinPackage: true,
	ignoreMatches: [
		"eslint-*",
		"react-*",
		"@mui/*",
		"@types/*",
		"dayjs",
		"qs",
		"redux-persist",
		"css-loader",
		"sass-loader",
		"style-loader",
	],
};

depcheck(__dirname, options, unused => {
	console.log("Unused dependencies:", unused.dependencies);
	console.log("Unused devDependencies:", unused.devDependencies);
	if (unused.dependencies.length || unused.devDependencies.length) {
		console.warn("Warning: Unused npm packages found.");
	}
	process.exit(0);
});
