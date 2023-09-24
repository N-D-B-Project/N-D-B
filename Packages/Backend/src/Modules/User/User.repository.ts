import { Inject, Injectable } from "@nestjs/common";
import { userInfo } from "src/@Types";
import { Services } from "src/@Types/Constants";
import { PrismaService } from "../Database/Prisma.service";

@Injectable()
export class UserRepository {
  constructor(
    @Inject(Services.PRISMA) private readonly prisma: PrismaService
  ) {}

  public async get(userId: string) {
    return await this.prisma.user.findFirst({
      where: {
        id: userId
      },
      include: {
        APIUser: true,
        NDCash: true,
        UserSettings: true
      }
    });
  }

  public async create(userDTO: userInfo) {
    return await this.prisma.user.create({
      data: {
        id: userDTO.userId,
        Username: userDTO.username,
        APIUser: {
          create: {
            email: userDTO.email,
            accessToken: userDTO.accessToken,
            refreshToken: userDTO.refreshToken
          }
        }
      },
      include: {
        NDCash: true,
        UserSettings: true
      }
    });
  }

  public async update(userDTO: userInfo) {
    const { userId: id, ...data } = userDTO;
    return await this.prisma.user.update({
      where: { id },
      data: {
        Username: data.username,
        APIUser: {
          update: {
            email: userDTO.email,
            accessToken: userDTO.accessToken,
            refreshToken: userDTO.refreshToken
          }
        }
      }
    });
  }
}
