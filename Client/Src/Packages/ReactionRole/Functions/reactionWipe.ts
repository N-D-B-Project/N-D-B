import { GuildConfig as Schema } from "@Database/Schemas";
import { Logger } from "~/Utils/Tools";
import { Document } from "mongoose";
import { Guild } from "discord.js";

export default async function reactionWipe(guild: Guild) {
  const logger: Logger = new Logger();
  const data: Document = await Schema.findOne({
    ID: guild.id,
  });

  var GET = await data.get("ReactionRole");

  try {
    if (GET.length <= 0) {
      return false;
    }
    while (GET.length > 0) {
      GET.pop();
    }
    await data.save();
    console.log(data);
    logger.database(
      `Todas as Reaction Roles em ${guild.name} foram deletadas com sucesso!`
    );
    return true;
  } catch (error) {
    logger.error(
      `Erro ao deletar todas as Reaction Roles em ${
        guild.name
      }!\nErro: ${String(error)}`
    );
    return false;
  }
}
