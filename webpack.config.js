const path = require("node:path");
const nodeExternals = require("webpack-node-externals");
const { RunScriptWebpackPlugin } = require("run-script-webpack-plugin");

module.exports = (options, webpack) => ({
	...options,
	entry: {
		main: ["webpack/hot/poll?100", options.entry],
		bot: ["webpack/hot/poll?100", path.join(__dirname, "src", "lib", "bot.ts")],
	},
	target: "node",
	externals: [
		nodeExternals({
			allowlist: ["webpack/hot/poll?100"],
		}),
	],
	output: {
		filename: (pathData) => {
			if (pathData.chunk.name === "main") {
				return "src/main.js";
			}

			if (pathData.chunk.name === "bot") {
				return "src/lib/bot.js";
			}
		},
	},
	plugins: [
		...(options.plugins || []),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.WatchIgnorePlugin({
			paths: [/\.js$/, /\.d\.ts$/],
		}),
		new RunScriptWebpackPlugin({
			name: "src/main.js",
			autoRestart: false,
		}),
	],
});
