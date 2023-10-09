import ReactionRole from "@/Modules/ReactionRole";
import {
  InvalidChannelEmbed,
  InvalidEmojiEmbed,
  InvalidIDEmbed,
  InvalidRoleEmbed,
  MessageNotFoundEmbed,
  ReactionRoleRemovedEmbed,
  UnableToDeleteReactionRoleEmbed
} from "@/Modules/ReactionRole/Utils/Embeds";
import { CommandOptions, INDBClient } from "@/Types";
import { BaseCommand, Context } from "@/Utils/Structures";
import { Message as DMessage, TextChannel } from "discord.js";

export default class DeleteReactionCommand extends BaseCommand {
  constructor(client: INDBClient) {
    const options: CommandOptions = {
      name: "DeleteReaction",
      aliases: [
        "DReaction",
        "RemoveReaction",
        "removereaction",
        "dreaction",
        "rreaction",
        "ReactionDelete"
      ],
      description: "Deleta uma Reaction Role existente",
      category: "🎩 ReactionRole",
      usage: "<Canal> <MessageID> <Cargo> <Emoji>",
      disable: false,
      cooldown: 0,
      permissions: {
        user: ["SendMessages", "AddReactions", "ManageRoles"],
        bot: ["EmbedLinks", "AddReactions", "ManageRoles"],
        guildOnly: false,
        ownerOnly: false
      },
      minArgs: 4,
      maxArgs: 4,
      nsfw: false,
      ndcash: 0,
      DM: false,
      slash: {
        type: "Sub",
        name: "delete"
      }
    };
    super(client, options);
  }

  async run(context: Context) {
    const reaction = new ReactionRole(context.client, "Delete");
    const Channel = (await context.getChannel("channel", 0)) as TextChannel;
    const MessageID = context.getArg("message", 1) as string;
    var Message = (await Channel.messages.fetch(MessageID)) as DMessage;
    const Role = await context.getRole("role", 2);
    const Emoji = context.getArg("emoji", 3) as string;

    if (!context.isSlash) {
      if (!Channel) {
        return await context.send(await InvalidChannelEmbed(context));
      }

      if (!MessageID) {
        return await context.send(await InvalidIDEmbed(context));
      }

      if (!Role || Role.managed) {
        return await context.send(await InvalidRoleEmbed(context));
      }

      if (!Emoji) {
        return await context.send(await InvalidEmojiEmbed(context));
      }
    }

    if (!Message) {
      return await context.reply(await MessageNotFoundEmbed(context));
    }

    const REACT = await reaction.Delete(context.guild, {
      Channel: Channel.id,
      Message: Message.id,
      Role: Role.id,
      Emoji
    });

    if (REACT.status === "Deleted") {
      await context.send(await ReactionRoleRemovedEmbed(context, Message));
      await Message.reactions.cache.get(Emoji).remove();
    } else {
      context.send(await UnableToDeleteReactionRoleEmbed(context, Message));
    }
  }
}
