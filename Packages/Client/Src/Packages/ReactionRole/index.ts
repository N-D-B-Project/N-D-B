import NDBClient from "@Client/NDBClient";
import BaseReactionRole from "./Structures/BaseReactionRole";
import { Create } from "./Functions";
import { eCommandType } from "~/Types";
import { FetchType, REACTION_OPTIONS } from "./Types";
import type {
  Message,
  Interaction,
  Guild,
  GuildChannel,
  TextChannel,
  Role,
  Emoji,
} from "discord.js";

export default class ReactionRole implements BaseReactionRole {
  public constructor(
    public client: NDBClient,
    public readonly Command: string
  ) {
    this.client = client;
  }
  async Create(
    CommandType: eCommandType,
    MsgInt: Message | Interaction,
    ChannelId: TextChannel["id"],
    GuildId: Guild["id"],
    MessageId: Message["id"],
    RoleId: Role["id"],
    Emoji: Emoji["id"] | Emoji["identifier"],
    Option: REACTION_OPTIONS
  ): Promise<boolean> {
    if (CommandType === eCommandType.MESSAGE) {
      return await Create(
        this.client,
        CommandType,
        MsgInt,
        ChannelId,
        GuildId,
        MessageId,
        RoleId,
        Emoji,
        Option
      );
    } else if (CommandType === eCommandType.INTERACTION) {
      return await Create(
        this.client,
        CommandType,
        MsgInt,
        ChannelId,
        GuildId,
        MessageId,
        RoleId,
        Emoji,
        Option
      );
    }
  }

  async Delete(
    Guild: Guild,
    ChannelId: TextChannel["id"],
    MessageId: Message["id"],
    RoleId: Role["id"],
    Emoji: Emoji["id"] | Emoji["identifier"]
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async Edit(
    Guild: Guild,
    ChannelId: TextChannel["id"],
    MessageId: Message["id"],
    RoleId: Role["id"],
    NewRoleId: Role["id"],
    Emoji: Emoji["id"] | Emoji["identifier"],
    NewEmoji: Emoji["id"] | Emoji["identifier"],
    Option: REACTION_OPTIONS,
    NewOption?: REACTION_OPTIONS
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async Wipe(Guild: Guild): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async Fetch(
    Guild: Guild,
    FetchType: FetchType,
    Channel?: GuildChannel
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
