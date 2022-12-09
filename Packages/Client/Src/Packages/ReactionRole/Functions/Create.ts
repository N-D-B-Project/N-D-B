import { EmbedBuilder } from "discord.js";
import type {
  Message,
  Interaction,
  CommandInteraction,
  TextChannel,
  Guild,
  Role,
  Emoji,
} from "discord.js";
import { Document } from "mongoose";
import { eCommandType } from "~/Types";
import { iReactionSchema } from "~/Types/schemas";
import { REACTION_OPTIONS } from "../Types";
import NDBClient from "~/Client/NDBClient";
import { MessageTools, InteractionTools } from "~/Utils/Tools";
import { GuildConfig } from "~/Database/Schemas";
import { Emojis } from "~/Config/Config";

async function Create(
  client: NDBClient,
  CommandType: eCommandType,
  MsgInt: Message | Interaction,
  ChannelId: TextChannel["id"],
  GuildId: Guild["id"],
  MessageId: Message["id"],
  RoleId: Role["id"],
  Emoji: Emoji["id"] | Emoji["identifier"],
  Option: REACTION_OPTIONS
): Promise<boolean> {
  const Data: Document = await GuildConfig.findOne({ ID: GuildId });
  var Get: Array<iReactionSchema> = Data.get("ReactionRoles");
  const AllReactions: Array<iReactionSchema> = Get;
  var Verify: boolean = false;

  AllReactions.forEach(async (reaction: iReactionSchema) => {
    if (
      reaction.message === MessageId &&
      reaction.channel === ChannelId &&
      reaction.role === RoleId &&
      reaction.emoji === Emoji &&
      reaction.option === Option
    ) {
      Verify = true;
    }
  });

  try {
    if (Verify && CommandType === eCommandType.MESSAGE) {
      MessageTools.send((MsgInt as Message).channel, {
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: (MsgInt as Message).author.id,
              iconURL: (MsgInt as Message).author.displayAvatarURL(),
            })
            .setColor("#c20e00")
            .setDescription(
              await client.Translate.Guild(
                "🎩 ReactionRole/CreateReaction:UnableToCreate",
                MsgInt as Message,
                { fail: Emojis.fail }
              )
            ),
        ],
      });
      return false;
    } else if (!Verify && CommandType === eCommandType.MESSAGE) {
      const newReaction = {
        message: MessageId,
        channel: ChannelId,
        role: RoleId,
        emoji: Emoji,
        option: Option,
      };
      AllReactions.push(newReaction);
      Get = AllReactions;
      await Data.save();
      client.logger.database(
        `Reaction Role em ${(MsgInt as Message).guild.name} criada com sucesso!`
      );
      return true;
    } else if (Verify && CommandType === eCommandType.INTERACTION) {
      InteractionTools.reply(MsgInt as CommandInteraction, {
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: (MsgInt as Interaction).user.tag,
              iconURL: (MsgInt as Interaction).user.displayAvatarURL(),
            })
            .setColor("#c20e00")
            .setDescription(
              await client.Translate.Guild(
                "🎩 ReactionRole/CreateReaction:UnableToCreate",
                MsgInt as CommandInteraction,
                { fail: Emojis.fail }
              )
            ),
        ],
      });
      return false;
    } else if (!Verify && CommandType === eCommandType.INTERACTION) {
      const newReaction = {
        message: MessageId,
        channel: ChannelId,
        role: RoleId,
        emoji: Emoji,
        option: Option,
      };
      AllReactions.push(newReaction);
      Get = AllReactions;
      await Data.save();
      client.logger.database(
        `Reaction Role em ${(MsgInt as Message).guild.name} criada com sucesso!`
      );
      return true;
    }
  } catch (error: any) {
    client.logger.error(error);
  }
}

export { Create };
