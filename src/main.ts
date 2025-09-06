import * as dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
	EnvChecker,
	NodeHandler,
	otelSDK,
	PrismaExceptionFilter,
	ShardingManager,
	TopGGAutoPoster,
} from "./lib";

// biome-ignore lint/suspicious/noExplicitAny: any is required for HMR
declare const module: any;

async function bootstrap() {
	NodeHandler();
	const app = await NestFactory.create(AppModule);
	const configService = app.get<ConfigService>(ConfigService);
	const httpAdapter = app.getHttpAdapter();
	const logger = new Logger("Main");
	EnvChecker(configService);
	const ShardManager = new ShardingManager(configService, module.hot);

	await ShardManager.init();

	if (configService.get("NODE_ENV") === "production") {
		const TopGGPoster = new TopGGAutoPoster(
			configService.getOrThrow("TopGGToken"),
			ShardManager,
		);

		await TopGGPoster.init();
	}

	app.enableShutdownHooks();
	app.useGlobalFilters(PrismaExceptionFilter(httpAdapter));

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}

	try {
		otelSDK.start();
	} catch (error) {
		await app.listen(configService.get("PORT"));
		logger.error("An error occurred when starting: ", (error as Error).message);
	}
}
bootstrap();
