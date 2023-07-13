import NDBClient from "@/Core/NDBClient"
import { EventOptions } from "@/Types"
import { BaseEvent } from "@/Utils/Structures"

import { EmbedBuilder, TextChannel } from "discord.js"
import { Player, Track, TrackExceptionEvent } from "erela.js"

export default class trackErrorEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "trackError",
      type: "on",
      emitter: "music",
      enable: true
    }

    super(client, options)
  }

  async run(
    client: NDBClient,
    player: Player,
    track: Track,
    payload: TrackExceptionEvent
  ) {
    player.stop()

    var TextChannel = client.channels.cache.get(
      player.textChannel
    ) as TextChannel

    const embed = new EmbedBuilder()
      .setAuthor({
        name: client.user.tag,
        url: client.user.displayAvatarURL()
      })
      .setColor("#00c26f")
      .setTitle(
        await client.Translate.Guild(
          "Events/PlayerEvents:trackError:Embed:Title",
          TextChannel
        )
      )
      .setDescription(
        await client.Translate.Guild(
          "Events/PlayerEvents:playerMove:Embed:Description",
          TextChannel,
          { TITLE: track.title, URI: track.uri }
        )
      )
      .addFields([
        {
          name: await client.Translate.Guild(
            "Events/PlayerEvents:trackError:Embed:Fields:1",
            TextChannel
          ),
          value: await client.Translate.Guild(
            "Events/PlayerEvents:trackError:Embed:Fields:Content:1",
            TextChannel,
            { PAYLOAD: `payload.op` }
          )
        }
      ])
      .setThumbnail(track.artworkUrl)
      .setFooter({
        text: await client.Translate.Guild(
          "Events/PlayerEvents:trackError:Embed:Footer",
          TextChannel
        )
      })
      .setTimestamp()
    TextChannel.send({ embeds: [embed] })
  }
}
