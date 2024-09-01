import { NDBModule } from "@/modules/core/NDB.module";
import { NestFactory } from "@nestjs/core";

async function bootstrap() {
	await NestFactory.createApplicationContext(NDBModule);
}

bootstrap();
