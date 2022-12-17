import { Guild } from "discord.js"
import PrismaProvider from "../Prisma.provider"

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
    })
  }

  public async create(guild: Guild) {
    const Guild = await this.get(guild)
    if (!Guild)
      return await this.prisma.guild
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
          console.log(err)
        })
    return
  }

  public async update(oldGuild: Guild, newGuild: Guild) {
    return await this.prisma.guild.update({
      where: { id: oldGuild.id },
      data: {
        Name: newGuild.name,

        updatedAt: new Date()
      }
    })
  }

  public async delete(guild: Guild) {
    return await this.prisma.guild.delete({
      where: { id: guild.id }
    })
  }
}
