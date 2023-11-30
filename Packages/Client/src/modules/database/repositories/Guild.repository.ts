import { Services } from "@/types/Constants";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Guild as DBGuild } from "@prisma/client";
import { Guild } from "discord.js";
import { PrismaService } from "../prisma/Prisma.service";

enum Status {
  "Created",
  "Error"
}

@Injectable()
export class GuildRepository {
  constructor(
    @Inject(Services.Prisma) private readonly prisma: PrismaService
  ) {}

  private readonly logger = new Logger(GuildRepository.name);

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

  public async delete(guild: Guild) {
    return await this.prisma.guild.delete({
      where: { id: guild.id }
    });
  }

  public async getCreated(guild: Guild) {
    await this.create(guild).then(({ status }) => {
      if (status === Status.Created) {
        this.logger.log(`${guild.name} Configuration Crated on Database`);
      }
    });
    return await this.get(guild.id);
  }
}
