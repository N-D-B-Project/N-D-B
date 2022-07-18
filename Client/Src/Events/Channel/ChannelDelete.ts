import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import BaseEvent from "@Structures/BaseEvent";
import { ChannelType, GuildChannel, TextChannel } from "discord.js";

module.exports = class channelDeleteEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "channelDelete",
      type: "on",
      emitter: "client",
    };

    super(client, options);
  }

  async run(client: NDBClient, channel: GuildChannel) {
    if (channel.type === ChannelType.GuildVoice) {
      const Player = client.ErelaManager.players.get(channel.guild.id);
      if (!Player) return;
      if (
        channel.id === Player.voiceChannel ||
        channel.members.has(client.user.id)
      ) {
        Player.destroy();
        const TextChannel = client.channels.cache.get(
          Player.textChannel
        ) as TextChannel;
        TextChannel.send({
          content: await client.translate(
            "Events/ChannelDelete:Music:DeletedChannel",
            channel
          ),
        });
      }
    }
  }
};
