import { AppModule } from "@/app.module";
import fastifyCookie from "@fastify/cookie";
import fastifyHelmet from "@fastify/helmet";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { name } from "../package.json";
import { AxiosInterceptor } from "./common/interceptors/Axios.interceptor";
import { CommandInterceptor } from "./common/interceptors/Command.interceptor";
import { ShardingManager, TopGGAutoPoster } from "./lib";
import { Config } from "./modules/shared/config/types";

async function bootstrap() {
	const logger = new Logger("Main");
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
	const configService = app.get<ConfigService>(ConfigService);
	const Port = configService.get<number>("PORT");

	const fastifyInstance = app.getHttpAdapter().getInstance();
	fastifyInstance
		.addHook("onRequest", async (req, res) => {
			req.socket["encrypted"] = process.env.NODE_ENV === "production";
		})
		.decorateReply("setHeader", function (name: string, value: unknown) {
			this.header(name, value);
		})
		.decorateReply("end", function () {
			this.send("");
		});

	app.register(fastifyHelmet);
	app.register(fastifyCookie, {
		secret: configService.getOrThrow<Config["API"]>("API").CookieSecret,
		hook: "onRequest",
	});

	app.useGlobalInterceptors(new CommandInterceptor(), new AxiosInterceptor());
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

	const SwaggerConfig = new DocumentBuilder()
		.setTitle("N-D-B API Docs")
		.setDescription("View and test all routes and functions of N-D-B API")
		.setVersion("1.0")
		.build();

	const SwaggerDocument = SwaggerModule.createDocument(app, SwaggerConfig);
	SwaggerModule.setup("docs", app, SwaggerDocument);

	try {
		await app.listen(Port, "0.0.0.0");
		await ShardManager.init();
		await TopGGPoster.init();

		logger.log(`${name} Running on Port: ${Port} in ${process.env.ENVIRONMENT} mode | URL: ${await app.getUrl()}`);
	} catch (error) {
		logger.error("An error occurred when starting: ", (error as Error).message);
	}
}
bootstrap();
