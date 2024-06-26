import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { config } from "./modules/config";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			load: [config],
		}),
	],
})
export class AppModule {}
