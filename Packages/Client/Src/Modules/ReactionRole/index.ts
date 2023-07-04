import NDBClient from "@/Client/NDBClient"
import { Guild, TextChannel } from "discord.js"
import { iReaction, REACTION_OPTIONS } from "./Types"
import ReactionRoleRepository from "./Utils/ReactionRole.repository"

export default class ReactionRole {
  public constructor(
    private client: NDBClient,
    public readonly Command: string,
    private readonly prisma: ReactionRoleRepository = new ReactionRoleRepository()
  ) { }

  public async getAll(guild: Guild) {
    return await this.prisma.getAll(guild)
  }

  public async getInChannel(guild: Guild, channel: TextChannel) {
    return await this.prisma.getInChannel(guild, channel)
  }

  public async getOne(
    guild: Guild,
    { Channel, Message, Role, Emoji, Option }: iReaction
  ) {
    return await this.prisma.getOne(guild, {
      Channel,
      Message,
      Role,
      Emoji,
      Option
    })
  }

  public async Create(
    guild: Guild,
    { Channel, Message, Role, Emoji, Option }: iReaction
  ): Promise<{ status: "UnableToCreate" | "Created" }> {
    return await this.prisma.create(guild, {
      Channel,
      Message,
      Role,
      Emoji,
      Option
    })
  }

  public async Delete(
    guild: Guild,
    { Channel, Message, Role, Emoji }: iReaction
  ): Promise<{ status: "UnableToDelete" | "Deleted" }> {
    return await this.prisma.delete(guild, {
      Channel,
      Message,
      Role,
      Emoji
    })
  }

  public async DeleteAll(guild: Guild): Promise<{ status: "UnableToDelete" | "Deleted", count: number }> {
    return await this.prisma.deleteMany(guild)
  }

  public async Update(
    guild: Guild,
    { Channel, Message, Role, Emoji, Option }: iReaction,
    newOption: REACTION_OPTIONS
  ): Promise<{ status: "UnableToUpdate" | "Updated", oldOption?: REACTION_OPTIONS }> {
    return await this.prisma.update(guild, {
      Channel,
      Message,
      Role,
      Emoji,
      Option
    },
      newOption
    )
  }
}
