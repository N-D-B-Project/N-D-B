import { Module } from "@nestjs/common";
import { Services } from "src/@Types/Constants";
import { DiscordHttpService } from "./Discord-http.service";
import { DiscordController } from "./Discord.controller";
import { DiscordService } from "./Discord.service";

@Module({
  controllers: [DiscordController],
  providers: [
    {
      provide: Services.DISCORD,
      useClass: DiscordService
    },
    {
      provide: Services.DISCORD_HTTP,
      useClass: DiscordHttpService
    }
  ]
})
export class DiscordModule {}
