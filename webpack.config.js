import path from "node:path";

module.exports = (options) => ({
	...options,
	entry: {
		main: options.entry,
		bot: path.join(__dirname, "src", "lib/bot.ts"),
	},
	output: {
		filename: "lib/[name].js",
	},
});
