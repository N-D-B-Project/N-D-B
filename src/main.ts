import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ShardingManager, TopGGAutoPoster } from "./lib";
import type { Config } from "./modules/SharedModule/config/types";

async function bootstrap() {
	const logger = new Logger("Main");
  const configService = new ConfigService()
	const ShardManager = new ShardingManager(configService);
	const TopGGPoster = new TopGGAutoPoster(
		configService.getOrThrow<Config["TopGGToken"]>("TopGGToken"),
		ShardManager,
	);

	try {
		await ShardManager.init();
		await TopGGPoster.init();
	} catch (error) {
		logger.error("An error occurred when starting: ", (error as Error).message);
	}
}
bootstrap();
