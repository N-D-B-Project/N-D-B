import NDBClient from "@Client/NDBClient";
import * as Discord from "discord.js";
import {
  MessageTools as MESSAGE,
  InteractionTools as INTERACTION,
} from "~/Utils/Tools";
import { Emojis } from "~/Config/Emojis";
import { ReactionRole as Schema } from "@Database/Schemas";

async function MessageReactionCreate(
  client: NDBClient,
  message: Discord.Message,
  channelId: string,
  guildId: string,
  msgId: string,
  roleId: string,
  emoji: string,
  option?: number
) {
  try {
    if (!option) option = 1;

    const CONFIG = await Schema.findOne({
      ID: guildId,
    });

    var GetReactions = CONFIG.get("Reactions");
    const AllReactions = GetReactions;
    var Verify: boolean = false;

    AllReactions.forEach(async (reaction: any) => {
      if (
        reaction.message === msgId &&
        reaction.channel === channelId &&
        reaction.role === roleId &&
        reaction.emoji === emoji &&
        reaction.option === option
      ) {
        Verify = true;
      }
    });

    if (Verify) {
      MESSAGE.send(message.channel, {
        embeds: [
          new Discord.MessageEmbed()
            .setAuthor({
              name: message.author.id,
              iconURL: message.author.displayAvatarURL(),
            })
            .setColor("#c20e00")
            .setDescription(
              await client.translate(
                "🎩 ReactionRole/CreateReaction:UnableToCreate",
                message,
                { fail: Emojis.fail }
              )
            ),
        ],
      });
      return false;
    } else {
      const newReaction = {
        message: msgId,
        channel: channelId,
        role: roleId,
        emoji: emoji,
        option: option,
      };
      AllReactions.push(newReaction);
      GetReactions = AllReactions;
      await CONFIG.save();
      client.logger.database(
        `Reaction Role em ${message.guild.name} criada com sucesso!`
      );
      return true;
    }
  } catch (error: any) {
    client.logger.error(error);
  }
  return true;
}

async function InteractionReactionCreate(
  client: NDBClient,
  interaction: Discord.CommandInteraction,
  channelId: string,
  guildId: string,
  msgId: string,
  roleId: string,
  emoji: string,
  option?: number
) {
  try {
    if (!option) option = 1;

    const CONFIG = await Schema.findOne({
      ID: guildId,
    });

    var GetReactions = CONFIG.get("Reactions");
    const AllReactions = GetReactions;
    var Verify: boolean = false;

    AllReactions.forEach(async (reaction: any) => {
      if (
        reaction.message === msgId &&
        reaction.channel === channelId &&
        reaction.role === roleId &&
        reaction.emoji === emoji &&
        reaction.option === option
      ) {
        Verify = true;
      }
    });

    if (Verify) {
      INTERACTION.reply(interaction, {
        embeds: [
          new Discord.MessageEmbed()
            .setAuthor({
              name: interaction.user.id,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setColor("#c20e00")
            .setDescription(
              await client.translate(
                "🎩 ReactionRole/CreateReaction:UnableToCreate",
                interaction,
                { fail: Emojis.fail }
              )
            ),
        ],
      });

      return false;
    } else {
      const newReaction = {
        message: msgId,
        channel: channelId,
        role: roleId,
        emoji: emoji,
        option: option,
      };
      AllReactions.push(newReaction);
      GetReactions = AllReactions;
      await CONFIG.save();
      client.logger.database(
        `Reaction Role em ${interaction.guild.name} criada com sucesso!`
      );
      return true;
    }
  } catch (error: any) {
    client.logger.error(error);
  }

  return true;
}

export { MessageReactionCreate, InteractionReactionCreate };
