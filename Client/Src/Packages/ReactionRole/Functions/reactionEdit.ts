import { ReactionRole as Schema } from "@Database/Schemas";
import { Logger } from "~/Utils/Tools";
import { Document } from "mongoose";
import { Guild } from "discord.js";

export default async function reactionEdit(
  guild: Guild,
  channelId: string,
  messageId: string,
  roleId: string,
  newRoleId: string,
  emoji: string,
  newEmoji: string,
  newOption?: number
) {
  if (!newOption) newOption = 1;
  const logger: Logger = new Logger();

  const data: Document = await Schema.findOne({ ID: guild.id });
  var GET = await data.get("Reactions");
  var OBJ;

  try {
    for (let i = 0; i < GET.length; i++) {
      if (
        GET[i].message == messageId &&
        GET[i].channel == channelId &&
        GET[i].role == roleId &&
        GET[i].emoji == emoji
      ) {
        OBJ = {
          messageId,
          channelId,
          newRoleId,
          newEmoji,
          newOption,
        };
        GET.splice(i, 1);
      }
    }

    GET.push(OBJ);
    await data.save();
    logger.database(`Reaction Role em ${guild.name} editada com sucesso!`);
    return true;
  } catch (error) {
    logger.error(
      `Erro ao editar Reaction Role em ${guild.name}!\nErro: ${String(error)}`
    );
    return false;
  }
}
