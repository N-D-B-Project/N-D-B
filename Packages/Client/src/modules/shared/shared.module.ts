import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { config } from "./config/Config";
import { DatabaseModule } from "./database/database.module";

@Global()
@Module({
	imports: [
		DatabaseModule,
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			load: [config],
		}),
	],
})
export class SharedModule {}
