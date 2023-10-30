import { Context } from "@/Utils/Structures";
import { channelMention } from "discord.js";
import MusicTools from "./Tools";

export default class Leave {
  public static async run(context: Context) {
    const player = await MusicTools.getPlayer(context);
    const VoiceChannel = await context.guild.channels.fetch(
      player.voiceChannelId
    );
    if (!(await MusicTools.Checkers(context))) return;
    await player.disconnect(true);
    return await context.client.Translate.Guild("Tools/Music:Leave", context, {
      VoiceChannel: channelMention(VoiceChannel.id)
    });
  }
}
