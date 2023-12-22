import { AppModule } from "@/app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
// import { ShardingManager } from "discord.js";
import { config } from "dotenv";
// import path from "path";
import { name } from "../package.json";
import { CommandInterceptor } from "./common/interceptors/Command.interceptor";
// import { Config } from "./types";

async function bootstrap() {
	config();
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

	try {
		await app.listen(Port);

		// const ShardManager = new ShardingManager(path.join(__dirname, "bot.js"), {
		//   token: configService.getOrThrow<Config["Discord"]>("Discord").Token
		// });

		// ShardManager.on("shardCreate", shard => {
		//   shard.on("reconnecting", () => {
		//     logger.warn(`Reconnecting shard: [${shard.id}]`);
		//   });

		//   shard.on("spawn", () => {
		//     logger.log(`Spawned shard: [${shard.id}]`);
		//   });

		//   shard.on("ready", () => {
		//     logger.log(` Shard [${shard.id}] is ready`);
		//   });

		//   shard.on("death", () => {
		//     logger.fatal(`Died shard: [${shard.id}]`);
		//   });

		//   shard.on("error", err => {
		//     logger.error(`Error in  [${shard.id}] with : ${err} `);
		//     shard.respawn();
		//   });
		// });

		logger.log(`${name} Running on Port: ${Port} in ${process.env.ENVIRONMENT} mode`);
	} catch (error) {
		logger.error("An error occurred when starting: ", (error as Error).message);
	}
}
bootstrap();
