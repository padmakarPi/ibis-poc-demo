const depcheck = require("depcheck");

const options = {
	ignoreMissing: true,
	ignoreBinPackage: true,
	ignoreMatches: [
		"eslint-*",
		"react-*",
		"@mui/*",
		"@types/*",
		"dayjs",
		"redux-persist",
		"css-loader",
		"sass-loader",
		"style-loader",
		"zod"
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
