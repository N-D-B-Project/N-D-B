import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import BaseEvent from "@Structures/BaseEvent";
import { EmbedBuilder, TextChannel } from "discord.js";
import { Payload, Player, Track } from "erela.js";
import { Emojis } from "~/Config/ClientUtils";

export default class trackStuckEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "trackStuck",
      type: "on",
      emitter: "music",
    };

    super(client, options);
  }

  async run(client: NDBClient, player: Player, track: Track, payload: Payload) {
    player.stop();
    var TextChannel = client.channels.cache.get(
      player.textChannel
    ) as TextChannel;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: client.user.tag,
        url: client.user.displayAvatarURL(),
      })
      .setColor("#00c26f")
      .setTitle(
        await client.translate(
          "Events/PlayerEvents:trackStuck:Embed:Title",
          TextChannel,
          { EMOJI: Emojis.fail }
        )
      )
      .setDescription(
        await client.translate(
          "Events/PlayerEvents:trackStuck:Embed:Description",
          TextChannel,
          { TITLE: track.title, URI: track.uri }
        )
      )
      .setThumbnail(track.thumbnail)
      .setFooter(
        await client.translate(
          "Events/PlayerEvents:trackStuck:Embed:Footer",
          TextChannel
        )
      )
      .setTimestamp();
    TextChannel.send({ embeds: [embed] });
  }
}
