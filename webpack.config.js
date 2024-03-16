const path = require("node:path");

module.exports = (options) => ({
	...options,
	entry: {
		main: options.entry,
		bot: Path.join(__dirname, "src", "bot.ts"),
	},
	output: {
		filename: "[name].js",
	},
});
