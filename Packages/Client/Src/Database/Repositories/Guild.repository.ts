/* eslint-disable no-empty-function */
/* eslint-disable no-shadow */

import { Guild as DBGuild } from "@prisma/client";
import { Guild } from "discord.js";
import PrismaProvider from "../Prisma.provider";

enum Status {
  "Created",
  "Error"
}

export default class GuildRepository {
  public constructor(
    private readonly prisma: PrismaProvider = new PrismaProvider()
  ) {}

  public async get(guild: Guild) {
    return await this.prisma.guild.findUnique({
      where: { id: guild.id },
      include: {
        Settings: true
      }
    });
  }

  public async create(
    guild: Guild
  ): Promise<{ callback: void | DBGuild; status: Status }> {
    const Guild = await this.get(guild);
    var status = Status.Created;
    const callback = await this.prisma.guild
      .create({
        data: {
          id: guild.id,
          Name: guild.name,
          Settings: {
            create: {}
          }
        }
      })
      .catch(err => {
        console.log(err);
        status = Status.Error;
      });
    if (!Guild) {
      return {
        callback,
        status
      };
    }
    return;
  }

  public async update(oldGuild: Guild, newGuild: Guild) {
    return await this.prisma.guild.update({
      where: { id: oldGuild.id },
      data: {
        Name: newGuild.name,

        updatedAt: new Date()
      }
    });
  }

  public async delete(guild: Guild) {
    return await this.prisma.guild.delete({
      where: { id: guild.id }
    });
  }
}
