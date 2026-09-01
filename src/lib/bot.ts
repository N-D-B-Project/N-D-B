import { NestFactory } from "@nestjs/core";
import { NDBModule } from "#src/modules/core/NDB.module.js";

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(NDBModule);

	app.enableShutdownHooks();
}

bootstrap();
