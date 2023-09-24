/* eslint-disable @typescript-eslint/no-unused-vars */
import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";

import { EmbedBuilder, TextChannel } from "discord.js";

import { Emojis } from "@/Config/Config";
import { MessageTools } from "@/Utils/Tools";
import { Player, Track, TrackStuckEvent } from "lavalink-client";

export default class trackStuckEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "trackStuck",
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
    payload: TrackStuckEvent
  ) {
    console.log("trackStuck");
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
          "Events/PlayerEvents:trackStuck:Embed:Title",
          textChannel,
          { EMOJI: Emojis.fail }
        )
      )
      .setDescription(
        await client.Translate.Guild(
          "Events/PlayerEvents:trackStuck:Embed:Description",
          textChannel,
          { TITLE: track.info.title, URI: track.info.uri }
        )
      )
      .setThumbnail(track.info.artworkUrl)
      .setFooter({
        text: await client.Translate.Guild(
          "Events/PlayerEvents:trackStuck:Embed:Footer",
          textChannel
        )
      })
      .setTimestamp();
    MessageTools.send(textChannel, { embeds: [embed] });
  }
}
