import { Module } from "@nestjs/common";
import { Repositories, Services } from "src/@Types/Constants";
import { PrismaService } from "../Database/Prisma.service";
import { UserRepository } from "./User.repository";
import { USerService } from "./User.service";

@Module({
  providers: [
    {
      provide: Services.USER,
      useClass: USerService
    },
    {
      provide: Services.PRISMA,
      useClass: PrismaService
    },
    {
      provide: Repositories.USER,
      useClass: UserRepository
    }
  ],
  exports: [
    {
      provide: Services.USER,
      useClass: USerService
    }
  ]
})
export class UserModule {}
