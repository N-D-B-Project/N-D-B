import { Module } from "@nestjs/common";
import { Services } from "src/@Types/Constants";
import { GuildsController } from "./Guilds.controller";
import { GuildsService } from "./Guilds.service";

@Module({
  controllers: [GuildsController],
  providers: [
    {
      provide: Services.GUILDS,
      useClass: GuildsService
    }
  ]
})
export class GuildsModule {}
