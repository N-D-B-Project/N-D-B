import { Logger } from "@nestjs/common";

export function NodeHandler(): void {
	const logger = new Logger("NodeHandler");
	process.on("uncaughtException", (error, origin) => {
		logger.error(`Uncaught Exception:  ${error} | Origin: ${origin}`);
	});

	process.on("unhandledRejection", (reason, promise) => {
		logger.error(`Unhandled Rejection reason: ${reason} | at:`);
		console.log(promise);
	});
}
