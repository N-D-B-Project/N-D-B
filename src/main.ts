import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ShardingManager, TopGGAutoPoster } from "./lib";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get<ConfigService>(ConfigService);
	const logger = new Logger("Main");
	const ShardManager = new ShardingManager(configService);
	const TopGGPoster = new TopGGAutoPoster(configService.getOrThrow("TopGGToken"), ShardManager);

	try {
		await ShardManager.init();
		await TopGGPoster.init();
	} catch (error) {
		await app.listen(configService.get("PORT"));
		logger.error("An error occurred when starting: ", (error as Error).message);
	}
}
bootstrap();
