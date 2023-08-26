/* eslint-disable no-empty-function */

import NDBClient from "@/Core/NDBClient";
import { Guild, TextChannel } from "discord.js";
import { REACTION_OPTIONS, iReaction } from "./Types";

export default class ReactionRole {
  public constructor(
    private readonly client: NDBClient,
    public readonly Command: string
  ) {}

  public async getAll(guild: Guild) {
    return await this.client.database.ReactionRoleRepo.getAll(guild);
  }

  public async getInChannel(guild: Guild, channel: TextChannel) {
    return await this.client.database.ReactionRoleRepo.getInChannel(
      guild,
      channel
    );
  }

  public async getOne(
    guild: Guild,
    { Channel, Message, Role, Emoji, Option }: iReaction
  ) {
    return await this.client.database.ReactionRoleRepo.getOne(guild, {
      Channel,
      Message,
      Role,
      Emoji,
      Option
    });
  }

  public async Create(
    guild: Guild,
    { Channel, Message, Role, Emoji, Option }: iReaction
  ): Promise<{ status: "UnableToCreate" | "Created" }> {
    return await this.client.database.ReactionRoleRepo.create(guild, {
      Channel,
      Message,
      Role,
      Emoji,
      Option
    });
  }

  public async Delete(
    guild: Guild,
    { Channel, Message, Role, Emoji }: iReaction
  ): Promise<{ status: "UnableToDelete" | "Deleted" }> {
    return await this.client.database.ReactionRoleRepo.delete(guild, {
      Channel,
      Message,
      Role,
      Emoji
    });
  }

  public async DeleteAll(
    guild: Guild
  ): Promise<{ status: "UnableToDelete" | "Deleted"; count: number }> {
    return await this.client.database.ReactionRoleRepo.deleteMany(guild);
  }

  public async Update(
    guild: Guild,
    { Channel, Message, Role, Emoji, Option }: iReaction,
    newOption: REACTION_OPTIONS
  ): Promise<{
    status: "UnableToUpdate" | "Updated";
    oldOption?: REACTION_OPTIONS;
  }> {
    return await this.client.database.ReactionRoleRepo.update(
      guild,
      {
        Channel,
        Message,
        Role,
        Emoji,
        Option
      },
      newOption
    );
  }
}
