import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NDBModule } from "@/modules/core/NDB.module";

// biome-ignore lint/suspicious/noExplicitAny: any is required for HMR
declare const module: any;

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(NDBModule);

	app.enableShutdownHooks();

	if (module.hot) {
		const logger = new Logger("HMR");
		logger.log("Hot Module Replacement (HMR) is enabled.");
		module.hot.accept();
		module.hot.dispose(async () => {
			logger.warn("Shutting down current context...");
			await app.close();
		});
	}
}

bootstrap();
