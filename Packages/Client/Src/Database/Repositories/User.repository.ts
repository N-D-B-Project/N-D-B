/* eslint-disable no-empty-function */

import { User } from "discord.js";
import PrismaProvider from "../Prisma.provider";

export default class UserRepository {
  public constructor(private readonly prisma: PrismaProvider) {}

  public async get(userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        Settings: true,
        NDCash: true
      }
    });
  }

  public async create(user: User) {
    return await this.prisma.user.create({
      data: {
        id: user.id,
        Username: user.username
      }
    });
  }

  public async update(user: User) {
    return await this.prisma.user.update({
      where: { id: user.id },
      data: {
        Username: user.username
      }
    });
  }

  // eslint-disable-next-line no-shadow
  // public async updateDatabase(userId: string, { User, Settings }: newDatabase) {
  //   await this.prisma.user.update({
  //     where: { id: userId },
  //     data: {
  //       Username: User.username,
  //       databaseVersion: User.databaseVersion,
  //       updatedAt: new Date()
  //     }
  //   });
  //   await this.prisma.userSettings.update({
  //     where: { id: userId },
  //     data: {
  //       Prefix: Settings.Prefix,
  //       Language: Settings.Language
  //     }
  //   });
  // }

  public async remove(user: User) {
    return await this.prisma.user.delete({
      where: { id: user.id }
    });
  }
}

// interface newDatabase {
//   User: {
//     username: string;
//     databaseVersion: string;
//   };
//   Settings: {
//     Prefix: string;
//     Language: string;
//   };
// }
