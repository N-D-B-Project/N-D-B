import NDBClient from "@Client/NDBClient";
import {
  Interaction,
  Message,
  Channel,
  Guild,
  Role,
  Emoji,
  GuildChannel,
} from "discord.js";
import { eCommandType } from "~/Types";
import { REACTION_OPTIONS, FetchType } from "../Types";

export default class BaseReactionRole {
  public constructor(
    public client: NDBClient,
    public readonly Command: string
  ) {
    this.client = client;
  }

  async Create(
    CommandType: eCommandType,
    MsgInt: Message | Interaction,
    GuildId: Guild["id"],
    ChannelId: Channel["id"],
    MessageId: Message["id"],
    RoleId: Role["id"],
    Emoji: Emoji["name"] | Emoji["identifier"],
    Option: REACTION_OPTIONS
  ): Promise<boolean> {
    throw new Error("501: Method not implemented");
  }

  async Delete(
    Guild: Guild,
    ChannelId: Channel["id"],
    MessageId: Message["id"],
    RoleId: Role["id"],
    Emoji: Emoji["name"] | Emoji["identifier"]
  ): Promise<boolean> {
    throw new Error("501: Method not implemented");
  }

  async Edit(
    Guild: Guild,
    ChannelId: Channel["id"],
    MessageId: Message["id"],
    RoleId: Role["id"],
    NewRoleId: Role["id"],
    Emoji: Emoji["name"] | Emoji["identifier"],
    NewEmoji: Emoji["name"] | Emoji["identifier"],
    NewOption?: REACTION_OPTIONS
  ): Promise<boolean> {
    throw new Error("501: Method not implemented");
  }

  async Wipe(Guild: Guild): Promise<boolean> {
    throw new Error("501: Method not implemented");
  }

  async Fetch(
    Guild: Guild,
    FetchType: FetchType,
    Channel?: GuildChannel
  ): Promise<boolean> {
    throw new Error("501: Method not implemented");
  }
}
