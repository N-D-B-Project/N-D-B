import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/api/auth/auth.module";
import { DiscordModule } from "./modules/api/discord/discord.module";
import { UserModule } from "./modules/api/user/user.module";
import { DatabaseModule } from "./modules/shared/database/database.module";
import { SharedModule } from "./modules/shared/shared.module";

@Module({
	imports: [SharedModule, AuthModule, DatabaseModule, UserModule, DiscordModule],
})
export class AppModule {}
