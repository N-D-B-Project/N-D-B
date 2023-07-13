import NDBClient from "@/Core/NDBClient"
import MusicTools from "@/Modules/Music/Utils/Tools"
import { EventOptions } from "@/Types"
import { BaseEvent } from "@/Utils/Structures"
import { MessageTools } from "@/Utils/Tools"
import { ChannelType, GuildChannel, TextChannel } from "discord.js"

export default class channelDeleteEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "channelDelete",
      type: "on",
      emitter: "client",
      enable: true
    }

    super(client, options)
  }

  async run(client: NDBClient, channel: GuildChannel) {
    const Player = await MusicTools.getPlayer(client, channel.guildId)
    if (
      channel.type === ChannelType.GuildVoice &&
      Player &&
      Player.voiceChannel === channel.id &&
      channel.members.has(client.user.id)
    ) {
      Player.destroy()
      const TextChannel = (await channel.guild.channels.fetch(
        Player.textChannel
      )) as TextChannel
      MessageTools.send(TextChannel, {
        content: await client.Translate.Guild(
          "Events/ChannelDelete:Music:DeletedChannel",
          channel
        )
      })
    }
  }
}
