import NDBClient from "@/Client/NDBClient"
import { GuildRepository } from "@/Database/Repositories"
import { BaseEvent } from "@/Utils/Structures"
import { EventOptions } from "@n-d-b/types"
import { ChannelType, Message } from "discord.js"

export default class MessageCreateEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "messageCreate",
      type: "on",
      emitter: "client",
      enable: true
    }

    super(client, options)
  }

  async run(client: NDBClient, message: Message) {
    if (message.author.bot) return
    const guildRepository = new GuildRepository()

    // GuildConfig
    const guildConfig = await guildRepository.get(message.guild)
    if (!guildConfig && message.channel.type !== ChannelType.DM) {
      await guildRepository.create(message.guild)
    } else if (guildConfig && message.channel.type !== ChannelType.DM) {
      const mentionRegex = RegExp(`<@!${client.user.id}>$`)
      const mentionRegexPrefix = RegExp(`^<@!${client.user.id}> `)

      var Prefix = message.content.match(mentionRegexPrefix)
        ? message.content.match(mentionRegexPrefix)[0]
        : guildConfig.Settings.Prefix

      if (message.content == Prefix) return

      if (!message.content.startsWith(Prefix)) return

      //TODO Doesn't working...
      if (message.content.match(mentionRegex)) {
        message.channel.send(
          await client.Translate.Guild(
            "Events/MessageCreate:MyPrefix",
            message,
            {
              GUILD_NAME: message.guild.name,
              PREFIX: Prefix
            }
          )
        )
        return
      }

      // Commands
      if (message.content.startsWith(Prefix)) {
        client.emit("Command", message, Prefix)
      }
    } else if (message.channel.type === ChannelType.DM) {
      client.emit("DMCommand", message, "&")
    }
  }
}
