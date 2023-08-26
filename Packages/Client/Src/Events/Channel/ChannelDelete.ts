import NDBClient from "@/Core/NDBClient";
import MusicTools from "@/Modules/Music/Utils/Tools";
import { EventOptions } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { MessageTools } from "@/Utils/Tools";
import { ChannelType, GuildChannel, TextChannel } from "discord.js";

export default class channelDeleteEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "channelDelete",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: NDBClient, channel: GuildChannel) {
    const guildData = await client.database.GuildRepo.get(channel.guildId);
    const { Premium } = guildData.Settings;
    const Player = await MusicTools.getPlayer(client, channel.guildId, Premium);
    if (
      channel.type === ChannelType.GuildVoice &&
      Player &&
      Player.voiceChannelId === channel.id &&
      channel.members.has(client.user.id)
    ) {
      Player.destroy();
      const textChannel = (await channel.guild.channels.fetch(
        Player.textChannelId
      )) as TextChannel;
      MessageTools.send(textChannel, {
        content: await client.Translate.Guild(
          "Events/ChannelDelete:Music:DeletedChannel",
          channel
        )
      });
    }
  }
}
