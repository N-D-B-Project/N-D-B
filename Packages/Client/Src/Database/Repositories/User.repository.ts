/* eslint-disable no-empty-function */

import { User } from "discord.js";
import PrismaProvider from "../Prisma.provider";

export default class UserRepository {
  public constructor(
    private readonly prisma: PrismaProvider = new PrismaProvider()
  ) {}

  public async get(user: User) {
    return await this.prisma.user.findUnique({
      where: { id: user.id },
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

  public async remove(user: User) {
    return await this.prisma.user.delete({
      where: { id: user.id }
    });
  }
}
