import ReactionRole from "@/Modules/ReactionRole";
import { iReaction } from "@/Modules/ReactionRole/Types";
import {
  InvalidChannelEmbed,
  InvalidEmojiEmbed,
  InvalidIDEmbed,
  InvalidRoleEmbed,
  MessageNotFoundEmbed,
  ReactionRoleUpdatedEmbed
} from "@/Modules/ReactionRole/Utils/Embeds";
import { CommandOptions, INDBClient } from "@/Types";
import { BaseCommand, Context } from "@/Utils/Structures";
import { Message as DMessage, TextChannel } from "discord.js";

export default class UpdateReactionCommand extends BaseCommand {
  constructor(client: INDBClient) {
    const options: CommandOptions = {
      name: "UpdateReaction",
      aliases: ["REdit", "reactionedit", "RUpdate"],
      description: "Edita uma Reaction Role",
      category: "🎩 ReactionRole",
      usage:
        "<Channel> <MessageId> <Role> <Emoji> <new option>\nDica Utilize o comando **ReactionTypes** para ver os parâmetros para (new option)",
      disable: false,
      cooldown: 0,
      permissions: {
        user: ["SendMessages", "AddReactions", "ManageRoles"],
        bot: ["EmbedLinks", "AddReactions", "ManageRoles"],
        guildOnly: false,
        ownerOnly: false
      },
      minArgs: 7,
      maxArgs: 7,

      nsfw: false,
      ndcash: 0,
      DM: false
    };
    super(client, options);
  }

  async run(client: INDBClient, context: Context) {
    const reaction = new ReactionRole(client, "Update");
    const Channel = (await context.getChannel("channel", 0)) as TextChannel;
    const MessageID = context.getArg("message", 1) as string;
    var Message = (await Channel.messages.fetch(MessageID)) as DMessage;
    const Role = await context.getRole("role", 2);
    const Emoji = context.getArg("emoji", 3) as string;
    let Option = Number(context.getArg("type", 4));
    if (!Option || Option > 6 || isNaN(Option)) Option = 1;

    if (!context.isSlash) {
      if (!Channel) {
        return await context.send(await InvalidChannelEmbed(client, context));
      }

      if (!MessageID) {
        return await context.send(await InvalidIDEmbed(client, context));
      }

      if (!Role || Role.managed) {
        return await context.send(await InvalidRoleEmbed(client, context));
      }

      if (!Emoji) {
        return await context.send(await InvalidEmojiEmbed(client, context));
      }
    }

    if (!Message) {
      return await context.reply(await MessageNotFoundEmbed(client, context));
    }

    const data: iReaction = {
      Channel: Channel.id,
      Message: Message.id,
      Role: Role.id,
      Emoji
    };

    const updated = await reaction.Update(context.guild, data, Option);
    if (updated.status === "Updated") {
      context.send(
        await ReactionRoleUpdatedEmbed(client, context, data, Option)
      );
    } else {
      context.send("WIP Message _ UnableToUpdate");
    }
  }
}
