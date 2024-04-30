import { NestFactory } from "@nestjs/core";
import { NDBModule } from "../modules/core/NDB.module";

async function bootstrap() {
	await NestFactory.createApplicationContext(NDBModule);
}

bootstrap();
