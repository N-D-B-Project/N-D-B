import { Context } from "@/Utils/Structures";
import { VoiceChannel, channelMention } from "discord.js";
import MusicTools from "./Tools";

export default class Join {
  public static async run(context: Context) {
    var player = await MusicTools.getPlayer(context);

    if (!MusicTools.hasVoice(context)) return;

    if (!player) {
      player = await MusicTools.createPlayer(
        context,
        (await context.getMember()).voice.channel as VoiceChannel,
        context.channel.id
      );
    }

    if (!player.connected) {
      player.playerAuthor = context.author.id;
      await player.connect();
    }

    return await context.client.Translate.Guild("Tools/Music:Join", context, {
      VoiceChannel: channelMention(player.voiceChannelId)
    });
  }
}
