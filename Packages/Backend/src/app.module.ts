import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthModule, DiscordModule, GuildsModule, UserModule } from "./Modules";
@Module({
  imports: [
    PassportModule.register({ session: true }),
    AuthModule,
    UserModule,
    GuildsModule,
    DiscordModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
