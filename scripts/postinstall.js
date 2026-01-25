const { execSync } = require("node:child_process");

function commandExists(cmd) {
	try {
		execSync(`command -v ${cmd}`, { stdio: "ignore" });
		return true;
	} catch {
		return false;
	}
}

if (commandExists("prisma")) {
	execSync("prisma generate", { stdio: "inherit" });
}

if (commandExists("husky")) {
	execSync("husky install", { stdio: "inherit" });
}
