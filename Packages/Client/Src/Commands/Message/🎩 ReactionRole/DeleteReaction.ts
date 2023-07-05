import NDBClient from "@/Client/NDBClient"
import ReactionRole from "@/Modules/ReactionRole"
import {
  InvalidChannelEmbed,
  InvalidEmojiEmbed,
  InvalidIDEmbed,
  InvalidRoleEmbed,
  MessageNotFoundEmbed,
  ReactionRoleRemovedEmbed,
  UnableToDeleteReactionRoleEmbed
} from "@/Modules/ReactionRole/Utils/Embeds"
import { CommandOptions } from "@/Types"
import { BaseCommand } from "@/Utils/Structures"
import { MessageTools } from "@/Utils/Tools"
import { Message, TextChannel } from "discord.js"

export default class DeleteReactionCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
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
        bot: ["EmbedLinks", "AddReactions", "ManageRoles"]
      },
      minArgs: 4,
      maxArgs: 4,
      guildOnly: false,
      ownerOnly: false,
      nsfw: false,
      ndcash: 0,
      DM: false
    }
    super(client, options, args)
  }

  async run(client: NDBClient, message: Message, args: Array<string>) {
    const react: ReactionRole = new ReactionRole(client, "Delete")
    var Channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]) ||
      (message.guild.channels.cache.find(
        ch => ch.name === args[0]
      ) as TextChannel)
    Channel = Channel as TextChannel
    if (!Channel) {
      MessageTools.send(
        message.channel,
        await InvalidChannelEmbed(client, message, message.author)
      )
      return
    }

    if (!args[1]) {
      MessageTools.send(
        message.channel,
        await InvalidIDEmbed(client, message, message.author)
      )
      return
    }
    var MsgID = await Channel.messages.fetch(args[1]).catch(async () => {
      MessageTools.send(
        message.channel,
        await MessageNotFoundEmbed(client, message, message.author)
      )
      return
    })

    var Role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[2]) ||
      message.guild.roles.cache.find(rl => rl.name === args[2])
    if (!Role || Role.managed) {
      MessageTools.send(
        message.channel,
        await InvalidRoleEmbed(client, message, message.author)
      )
      return
    }

    const Emoji = args[3]
    if (!Emoji) {
      MessageTools.send(
        message.channel,
        await InvalidEmojiEmbed(client, message, message.author)
      )
      return
    }

    const REACT = await react.Delete(message.guild, {
      Channel: Channel.id,
      Message: (MsgID as Message).id,
      Role: Role.id,
      Emoji
    })

    if (REACT.status === "Deleted") {
      MessageTools.send(
        message.channel,
        await ReactionRoleRemovedEmbed(
          client,
          message,
          message.author,
          MsgID as Message
        )
      )
      await (MsgID as Message).reactions.cache.get(Emoji).remove()
    } else {
      MessageTools.send(
        message.channel,
        await UnableToDeleteReactionRoleEmbed(
          client,
          message,
          message.author,
          MsgID as Message
        )
      )
    }
  }
}
