import { Module } from "@nestjs/common";
import { Services } from "src/@Types/Constants";
import { Serializer } from "src/Utils/Serializer";
import { DiscordStrategy } from "../../Utils/DiscordStrategy";
import { PrismaService } from "../Database/Prisma.service";
import { UserModule } from "../User/User.module";
import { AuthController } from "./Auth.controller";
import { AuthService } from "./Auth.service";

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    DiscordStrategy,
    Serializer,
    {
      provide: Services.AUTH,
      useClass: AuthService
    },
    {
      provide: Services.PRISMA,
      useClass: PrismaService
    }
  ]
})
export class AuthModule {}
