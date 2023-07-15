import NDBClient from "@/Core/NDBClient";
import { EventOptions } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { MessageTools } from "@/Utils/Tools";

import { EmbedBuilder, TextChannel, VoiceChannel } from "discord.js";
import { Player } from "erela.js";

export default class playerMoveEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "playerMove",
      type: "on",
      emitter: "music",
      enable: true
    };

    super(client, options);
  }

  async run(
    client: NDBClient,
    player: Player,
    oldChannel: string,
    newChannel: string
  ) {
    if (!newChannel) {
      var textChannel = client.channels.cache.get(
        player.textChannel
      ) as TextChannel;
      var voiceChannel = client.channels.cache.get(
        player.voiceChannel
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
      player.voiceChannel = newChannel;
      if (player.paused) return;
      setTimeout(() => {
        player.pause(true);
        setTimeout(() => {
          player.pause(false);
        }, client.ws.ping * 2);
      }, client.ws.ping * 2);
    }
  }
}
