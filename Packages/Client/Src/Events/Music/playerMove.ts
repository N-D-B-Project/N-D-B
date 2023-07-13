import NDBClient from "@/Core/NDBClient"
import { EventOptions } from "@/Types"
import { BaseEvent } from "@/Utils/Structures"

import { EmbedBuilder, TextChannel, VoiceChannel } from "discord.js"
import { Player } from "erela.js"

export default class playerMoveEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "playerMove",
      type: "on",
      emitter: "music",
      enable: true
    }

    super(client, options)
  }

  async run(
    client: NDBClient,
    player: Player,
    oldChannel: string,
    newChannel: string
  ) {
    if (!newChannel) {
      var TextChannel = client.channels.cache.get(
        player.textChannel
      ) as TextChannel
      var VoiceChannel = client.channels.cache.get(
        player.voiceChannel
      ) as VoiceChannel

      const KickEmbed = new EmbedBuilder()
        .setAuthor({
          name: client.user.tag,
          url: client.user.displayAvatarURL()
        })
        .setColor("#00c26f")
        .setTitle(
          await client.Translate.Guild(
            "Events/PlayerEvents:playerMove:KickEmbed:Title",
            TextChannel
          )
        )
        .setDescription(
          await client.Translate.Guild(
            "Events/PlayerEvents:playerMove:KickEmbed:Description",
            TextChannel,
            { CHANNEL: VoiceChannel.name }
          )
        )
        .setFooter({
          text: await client.Translate.Guild(
            "Events/PlayerEvents:playerMove:KickEmbed:Footer",
            TextChannel
          )
        })
        .setTimestamp()
      TextChannel.send({ embeds: [KickEmbed] })
      try {
        TextChannel.messages.fetch(player.get("MESSAGE")).then(msg => {
          if (msg && msg.deletable) {
            setTimeout(() => {
              msg.delete()
            }, 2000)
          }
        })
      } catch (error) {
        client.logger.warn(String(error))
      }
      player.destroy()
    } else {
      player.voiceChannel = newChannel
      if (player.paused) return
      setTimeout(() => {
        player.pause(true)
        setTimeout(() => {
          player.pause(false)
        }, client.ws.ping * 2)
      }, client.ws.ping * 2)
    }
  }
}
