/* eslint-disable @typescript-eslint/no-unused-vars */
import NDBClient from "@/Core/NDBClient";
import { EventOptions } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { MessageTools } from "@/Utils/Tools";

import { EmbedBuilder, TextChannel } from "discord.js";
import { Player, Track, TrackExceptionEvent } from "erela.js";

export default class trackErrorEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "trackError",
      type: "on",
      emitter: "music",
      enable: true
    };

    super(client, options);
  }

  async run(
    client: NDBClient,
    player: Player,
    track: Track,
    payload: TrackExceptionEvent
  ) {
    player.stop();

    var textChannel = client.channels.cache.get(
      player.textChannel
    ) as TextChannel;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: client.user.tag,
        url: client.user.displayAvatarURL()
      })
      .setColor("#00c26f")
      .setTitle(
        await client.Translate.Guild(
          "Events/PlayerEvents:trackError:Embed:Title",
          textChannel
        )
      )
      .setDescription(
        await client.Translate.Guild(
          "Events/PlayerEvents:playerMove:Embed:Description",
          textChannel,
          { TITLE: track.title, URI: track.uri }
        )
      )
      .addFields([
        {
          name: await client.Translate.Guild(
            "Events/PlayerEvents:trackError:Embed:Fields:1",
            textChannel
          ),
          value: await client.Translate.Guild(
            "Events/PlayerEvents:trackError:Embed:Fields:Content:1",
            textChannel,
            { PAYLOAD: payload.op }
          )
        }
      ])
      .setThumbnail(track.artworkUrl)
      .setFooter({
        text: await client.Translate.Guild(
          "Events/PlayerEvents:trackError:Embed:Footer",
          textChannel
        )
      })
      .setTimestamp();
    MessageTools.send(textChannel, { embeds: [embed] });
  }
}
