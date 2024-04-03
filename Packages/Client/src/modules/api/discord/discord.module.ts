import { Services } from "@/types/Constants";
import { HttpModule } from "@nestjs/axios";
import { Module, Provider } from "@nestjs/common";
import { DiscordHttpService } from "./discord-http.service";
import { DiscordController } from "./discord.controller";
import { DiscordService } from "./discord.service";

const providers: Provider<DiscordService | DiscordHttpService>[] = [
	{
		provide: Services.Discord,
		useClass: DiscordService,
	},
	{
		provide: Services.Discord_HTTP,
		useClass: DiscordHttpService,
	},
];

@Module({
	imports: [HttpModule],
	controllers: [DiscordController],
	providers,
})
export class DiscordModule {}
