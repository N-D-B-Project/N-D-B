import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		coverage: {
			provider: "istanbul",
			reportsDirectory: "./test/coverage",
		},
		watch: false,
	},
});
