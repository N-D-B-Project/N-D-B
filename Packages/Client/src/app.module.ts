import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/api/auth/auth.module";
import { DiscordModule } from "./modules/api/discord/discord.module";
import { UserModule } from "./modules/api/user/user.module";
import { config } from "./modules/config/Config";
import { DatabaseModule } from "./modules/database/database.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			load: [config],
		}),
		AuthModule,
		DatabaseModule,
		UserModule,
		DiscordModule,
	],
})
export class AppModule {}
