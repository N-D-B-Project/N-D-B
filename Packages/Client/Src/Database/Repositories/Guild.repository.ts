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
  public constructor(private readonly prisma: PrismaProvider) {}

  public async get(guildId: string) {
    const find = await this.prisma.guild.findUnique({
      where: { id: guildId },
      include: {
        Settings: true
      }
    });
    return find;
  }

  public async create(
    guild: Guild
  ): Promise<{ callback: void | DBGuild; status: Status }> {
    const Guild = await this.get(guild.id);
    let status = Status.Created;
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

  // public async updateDatabase(
  //   guildId: string,
  //   { Guild, Settings }: newDatabase
  // ) {
  //   await this.prisma.guild.update({
  //     where: { id: guildId },
  //     data: {
  //       Name: Guild.name,
  //       databaseVersion: Guild.databaseVersion,
  //       updatedAt: new Date()
  //     }
  //   });
  //   await this.prisma.guildSettings.update({
  //     where: { id: guildId },
  //     data: {
  //       Prefix: Settings.Prefix,
  //       Language: Settings.Language,
  //       AntiSpam: Settings.AntiSpam,
  //       ReactionDM: Settings.ReactionDM,
  //       Premium: Settings.Premium
  //     }
  //   });
  // }

  public async delete(guild: Guild) {
    return await this.prisma.guild.delete({
      where: { id: guild.id }
    });
  }
}

// interface newDatabase {
//   Guild: {
//     name: string;
//     databaseVersion: string;
//   };
//   Settings: {
//     Prefix: string;
//     Language: string;
//     AntiSpam: boolean;
//     ReactionDM: boolean;
//     Premium: boolean;
//   };
// }
