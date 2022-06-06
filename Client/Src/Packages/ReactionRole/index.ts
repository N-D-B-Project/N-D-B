import NDBClient from "@Client/NDBClient";
import { connect, connection, Document } from "mongoose";
import { CommandInteraction, Guild, Message } from "discord.js";
import { ReactionRole as Schema } from "@Database/Schemas";
import {
  MessageReactionCreate,
  InteractionReactionCreate,
  ReactionDelete,
  ReactionEdit,
  reactionFetch,
  reactionFetchAll,
  ReactionWipe,
} from "./Functions";

export default class ReactionRole {
  public constructor(
    private client: NDBClient,
    private readonly Command: string
  ) {
    this.client = client;
  }

  async Login() {
    const ConnectOptions = {
      keepAlive: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };

    connect(process.env.MongoURI, ConnectOptions);
    connection.on("connected", () => {
      this.client.logger.database(
        `ReactionRole ${this.Command}: MongoDB Conectado!`
      );
    });

    connection.on("err", (err) => {
      this.client.logger.error(`Mongoose Connection error: ${err.stack}`);
    });

    connection.on("disconnected", () => {
      this.client.logger.error(`Mongoose Connection lost`);
    });
  }

  async FindGuild(guildId: string): Promise<Document> {
    const GuildRR = await Schema.findOne({ ID: guildId });
    return await GuildRR;
  }

  async PreCreate(guild: Guild) {
    try {
      await new Schema({
        ID: guild.id,
        Name: guild.name,
        DMInfoMSG: false,
        // Reactions: [{}],
      }).save();
      this.client.logger.database(
        `ReactionRole ${this.Command}: Guild ${guild.name} Config pre criada!`
      );
    } catch (error: any) {
      this.client.logger.error(error);
    }
  }

  async reactionCreate(
    type: "Message" | "Interaction",
    msgint: Message | CommandInteraction,
    channelId: string,
    guildId: string,
    msgId: string,
    roleId: string,
    emoji: string,
    option?: number
  ) {
    if (type === "Message") {
      msgint = msgint as Message;
      return await MessageReactionCreate(
        this.client,
        msgint,
        channelId,
        guildId,
        msgId,
        roleId,
        emoji,
        option
      );
    } else {
      msgint = msgint as CommandInteraction;
      return await InteractionReactionCreate(
        this.client,
        msgint,
        channelId,
        guildId,
        msgId,
        roleId,
        emoji,
        option
      );
    }
  }

  async reactionDelete(
    guild: Guild,
    msgId: string,
    channelId: string,
    roleId: string,
    emoji: string
  ) {
    return await ReactionDelete(guild, msgId, channelId, roleId, emoji);
  }

  async reactionEdit(
    guild: Guild,
    channelId: string,
    messageId: string,
    roleId: string,
    newRoleId: string,
    emoji: string,
    newEmoji: string,
    newOption?: number
  ) {
    return await ReactionEdit(
      guild,
      channelId,
      messageId,
      roleId,
      newRoleId,
      emoji,
      newEmoji,
      newOption
    );
  }

  async reactionWipe(guild: Guild) {
    return await ReactionWipe(guild);
  }

  async reactionFetch(
    guild: Guild,
    channel: string,
    type: "Channel" | "All"
  ): Promise<Array<any>> {
    if (type === "Channel") {
      return await reactionFetch(guild, channel);
    } else {
      return await reactionFetchAll(guild);
    }
  }
}
