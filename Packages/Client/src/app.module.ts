import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import Config from "./modules/config/Config";
import { NDBModule } from "./modules/core/NDB.module";

@Module({
  imports: [
    NDBModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [Config]
    })
  ],
  providers: []
})
export class AppModule {}
