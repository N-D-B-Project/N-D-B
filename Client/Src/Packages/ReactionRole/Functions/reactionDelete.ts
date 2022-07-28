import { GuildConfig as Schema } from "@Database/Schemas";
import { Logger } from "~/Utils/Tools";
import { Document } from "mongoose";
import { Guild } from "discord.js";

export default async function ReactionDelete(
  guild: Guild,
  msgId: string,
  channelId: string,
  role: string,
  emoji: string
) {
  const logger: Logger = new Logger();
  const data: Document = await Schema.findOne({
    ID: guild.id,
  });
  var GET = await data.get("ReactionRoles");

  try {
    if (GET.length <= 0) {
      return false;
    }
    for (let i = 0; i < GET.length; i++) {
      if (
        GET[i].message == msgId &&
        GET[i].channel == channelId &&
        GET[i].role == role &&
        GET[i].emoji == emoji
      ) {
        GET.splice(i, 1);
      }
    }
    await data.save();
    logger.database(`Reaction Role em ${guild.name} deletada com sucesso!`);
    return true;
  } catch (error) {
    logger.error(
      `Erro ao deletar Reaction Role em ${guild.name}!\nErro: ${String(error)}`
    );
    return false;
  }
}
