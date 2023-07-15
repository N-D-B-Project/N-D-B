/* eslint-disable @typescript-eslint/no-unused-vars */
import NDBClient from "@/Core/NDBClient";
import { EventOptions } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";

import { EmbedBuilder, TextChannel } from "discord.js";

import { Emojis } from "@/Config/Config";
import { MessageTools } from "@/Utils/Tools";
import { Player, Track, TrackStuckEvent } from "erela.js";

export default class trackStuckEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "trackStuck",
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
    payload: TrackStuckEvent
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
          "Events/PlayerEvents:trackStuck:Embed:Title",
          textChannel,
          { EMOJI: Emojis.fail }
        )
      )
      .setDescription(
        await client.Translate.Guild(
          "Events/PlayerEvents:trackStuck:Embed:Description",
          textChannel,
          { TITLE: track.title, URI: track.uri }
        )
      )
      .setThumbnail(track.artworkUrl)
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
