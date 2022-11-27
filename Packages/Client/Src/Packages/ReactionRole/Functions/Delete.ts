import {
  Message,
  type Emoji,
  type Guild,
  type Role,
  type TextChannel,
} from "discord.js";
import { Document } from "mongoose";
import NDBClient from "~/Client/NDBClient";
import { GuildConfig as Schema } from "@Database/Schemas";
import { iReactionSchema } from "~/Types/schemas";

export default async function Delete(
  client: NDBClient,
  Guild: Guild,
  MsgId: Message["id"],
  ChannelId: TextChannel["id"],
  RoleId: Role["id"],
  Emoji: Emoji["id"]
) {
  const Data: Document = await Schema.findOne({
    ID: Guild.id,
  });

  var GET: Array<iReactionSchema> = await Data.get("ReactionRoles");

  try {
    if (GET.length <= 0) {
      return false;
    }
    for (let i = 0; i < GET.length; i++) {
      if (
        GET[i].message == MsgId &&
        GET[i].channel == ChannelId &&
        GET[i].role == RoleId &&
        GET[i].emoji == Emoji
      ) {
        GET.splice(i, 1);
      }
    }
    await Data.save();
    client.logger.database(
      `Reaction Role em ${Guild.name} deletada com sucesso!`
    );
    return true;
  } catch (error) {
    client.logger.error(
      `Erro ao deletar Reaction Role em ${Guild.name}!\nErro: ${String(error)}`
    );

    return false;
  }
}
