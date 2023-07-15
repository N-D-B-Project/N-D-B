/* eslint-disable no-empty-function */
import { Prisma } from "@prisma/client";
import { User } from "discord.js";
import PrismaProvider from "../Prisma.provider";

export default class NDCashRepository {
  public constructor(
    private readonly prisma: PrismaProvider = new PrismaProvider()
  ) {}

  public async get(user: User) {
    return await this.prisma.NDCash.findUnique({
      where: { id: user.id }
    });
  }

  public async update(user: User, data: Prisma.NDCashUpdateInput) {
    return await this.prisma.NDCash.update({
      where: { id: user.id },
      data
    });
  }
}
