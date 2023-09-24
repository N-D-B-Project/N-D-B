import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { MessageTools } from "@/Utils/Tools";

import { EmbedBuilder, TextChannel, VoiceChannel } from "discord.js";
import { Player } from "lavalink-client";

export default class playerMoveEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "playerMove",
      type: "on",
      emitter: "music",
      enable: true
    };

    super(client, options);
  }

  async run(
    client: INDBClient,
    player: Player,
    oldChannel: string,
    newChannel: string
  ) {
    if (!newChannel) {
      const textChannel = client.channels.cache.get(
        player.textChannelId
      ) as TextChannel;
      const voiceChannel = client.channels.cache.get(
        player.voiceChannelId
      ) as VoiceChannel;

      const KickEmbed = new EmbedBuilder()
        .setAuthor({
          name: client.user.tag,
          url: client.user.displayAvatarURL()
        })
        .setColor("#00c26f")
        .setTitle(
          await client.Translate.Guild(
            "Events/PlayerEvents:playerMove:KickEmbed:Title",
            textChannel
          )
        )
        .setDescription(
          await client.Translate.Guild(
            "Events/PlayerEvents:playerMove:KickEmbed:Description",
            textChannel,
            { CHANNEL: voiceChannel.name }
          )
        )
        .setFooter({
          text: await client.Translate.Guild(
            "Events/PlayerEvents:playerMove:KickEmbed:Footer",
            textChannel
          )
        })
        .setTimestamp();
      MessageTools.send(textChannel, { embeds: [KickEmbed] });
      try {
        textChannel.messages.fetch(player.get("MESSAGE")).then(msg => {
          if (msg && msg.deletable) {
            setTimeout(() => {
              msg.delete();
            }, 2000);
          }
        });
      } catch (error) {
        client.logger.warn(String(error));
      }
      player.destroy();
    } else {
      player.voiceChannelId = newChannel;
      if (player.paused) return;
      setTimeout(() => {
        player.pause();
        setTimeout(() => {
          player.resume();
        }, client.ws.ping * 2);
      }, client.ws.ping * 2);
    }
  }
}
