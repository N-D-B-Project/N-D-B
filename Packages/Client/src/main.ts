import { AppModule } from "@/app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { name } from "../package.json";
import { CommandInterceptor } from "./common/interceptors/Command.interceptor";
import { ShardingManager, TopGGAutoPoster } from "./lib";
import { Config } from "./modules/config/types";

async function bootstrap() {
	const logger = new Logger("Main");
	const app = await NestFactory.create(AppModule);
	const configService = app.get<ConfigService>(ConfigService);
	const Port = configService.get<number>("PORT");

	app.useGlobalInterceptors(new CommandInterceptor());
	app.setGlobalPrefix("api");
	app.useGlobalPipes(
		new ValidationPipe({
			always: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	const ShardManager = new ShardingManager(configService);
	const TopGGPoster = new TopGGAutoPoster(configService.getOrThrow<Config["TopGGToken"]>("TopGGToken"), ShardManager);

	try {
		await app.listen(Port);
		await ShardManager.init();
		await TopGGPoster.init();

		logger.log(`${name} Running on Port: ${Port} in ${process.env.ENVIRONMENT} mode`);
	} catch (error) {
		logger.error("An error occurred when starting: ", (error as Error).message);
	}
}
bootstrap();
