import { Module } from "@nestjs/common";
import { DatabaseModule, SharedModule } from "./modules/SharedModule/index";
import { AuthModule } from "./modules/api/auth/auth.module";
import { DiscordModule } from "./modules/api/discord/discord.module";
import { UserModule } from "./modules/api/user/user.module";

@Module({
	imports: [SharedModule, AuthModule, DatabaseModule, UserModule, DiscordModule],
})
export class AppModule {}
