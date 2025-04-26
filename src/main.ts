import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
	NodeHandler,
	PrismaExceptionFilter,
	ShardingManager,
	TopGGAutoPoster,
	otelSDK,
} from "./lib";
import type { ConfigService } from "./modules/config/config.service";
import { Services } from "./types/Constants";

async function bootstrap() {
	NodeHandler();
	const app = await NestFactory.create(AppModule);
	const configService = app.get<ConfigService>(Services.Config);
	const httpAdapter = app.getHttpAdapter();
	const ShardManager = new ShardingManager(configService);

	if (configService.get("NODE_ENV") === "production") {
		const TopGGPoster = new TopGGAutoPoster(
			configService.get("TopGGToken"),
			ShardManager,
		);

		await TopGGPoster.init();
	}

	app.useGlobalFilters(PrismaExceptionFilter(httpAdapter));

	otelSDK.start();
	await ShardManager.init();
	await app.listen(configService.get("PORT"));
}
bootstrap();
