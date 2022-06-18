import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import BaseEvent from "@Structures/BaseEvent";
import { EmbedBuilder, TextChannel } from "discord.js";
import { Player, Track, Payload } from "erela.js";

export default class trackErrorEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "trackError",
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
          "Events/PlayerEvents:trackError:Embed:Title",
          TextChannel
        )
      )
      .setDescription(
        await client.translate(
          "Events/PlayerEvents:playerMove:Embed:Description",
          TextChannel,
          { TITLE: track.title, URI: track.uri }
        )
      )
      .addFields([
        {
          name: await client.translate(
            "Events/PlayerEvents:trackError:Embed:Fields:1",
            TextChannel
          ),
          value: await client.translate(
            "Events/PlayerEvents:trackError:Embed:Fields:Content:1",
            TextChannel,
            { PAYLOAD: payload.op }
          ),
        },
      ])
      .setThumbnail(track.thumbnail)
      .setFooter(
        await client.translate(
          "Events/PlayerEvents:trackError:Embed:Footer",
          TextChannel
        )
      )
      .setTimestamp();
    TextChannel.send({ embeds: [embed] });
  }
}
