const depcheck = require("depcheck");
const { IgnorePlugin } = require("webpack");

const options = {
	ignoreMissing: true, // Ignore missing dependencies
	ignoreBinPackage: true, // Ignore packages containing bin entry
	ignoreMatches: [
		"eslint-*",
		"react-*",
		"@mui/*",
		"@testing-library/*",
		"@types/*",
		"dayjs",
		"qs",
		"redux-persist",
		"css-loader",
		"sass-loader",
		"style-loader",
		"jest-environment-jsdom",
	],
};

depcheck(__dirname, options, unused => {
	console.log("Unused dependencies:", unused.dependencies);
	console.log("Unused devDependencies:", unused.devDependencies);
	if (unused.dependencies.length || unused.devDependencies.length) {
		console.warn("Warning: Unused npm packages found.");
	}
	process.exit(0); // Exit with a success code, showing only a warning
});
