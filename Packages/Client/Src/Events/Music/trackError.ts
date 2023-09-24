/* eslint-disable @typescript-eslint/no-unused-vars */
import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { MessageTools } from "@/Utils/Tools";

import { EmbedBuilder, TextChannel } from "discord.js";
import { Player, Track, TrackExceptionEvent } from "lavalink-client";

export default class trackErrorEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "trackError",
      type: "on",
      emitter: "music",
      enable: true
    };

    super(client, options);
  }

  async run(
    client: INDBClient,
    player: Player,
    track: Track,
    payload: TrackExceptionEvent
  ) {
    console.log("trackError");
    const textChannel = client.channels.cache.get(
      player.textChannelId
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
          { TITLE: track.info.title, URI: track.info.uri }
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
      .setThumbnail(track.info.artworkUrl)
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
