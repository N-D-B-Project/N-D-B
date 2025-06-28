import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
	EnvChecker,
	NodeHandler,
	PrismaExceptionFilter,
	ShardingManager,
	TopGGAutoPoster,
	otelSDK,
} from "./lib";

async function bootstrap() {
	NodeHandler();
	const app = await NestFactory.create(AppModule);
	const configService = app.get<ConfigService>(ConfigService);
	const httpAdapter = app.getHttpAdapter();
	const logger = new Logger("Main");
	EnvChecker(configService);
	const ShardManager = new ShardingManager(configService);

	await ShardManager.init();

	if (configService.get("NODE_ENV") === "production") {
		const TopGGPoster = new TopGGAutoPoster(
			configService.getOrThrow("TopGGToken"),
			ShardManager,
		);

		await TopGGPoster.init();
	}

	app.useGlobalFilters(PrismaExceptionFilter(httpAdapter));

	try {
		otelSDK.start();
	} catch (error) {
		await app.listen(configService.get("PORT"));
		logger.error("An error occurred when starting: ", (error as Error).message);
	}
}
bootstrap();
