import { Context } from "@/Utils/Structures";
import { VoiceChannel } from "discord.js";
import MusicTools from "./Tools";

export default class Multi {
  public static async run(context: Context) {
    var player = await MusicTools.getPlayer(context);

    if (!player) {
      player = await MusicTools.createPlayer(
        context,
        (await context.getMember()).voice.channel as VoiceChannel,
        context.channel.id
      );
    }
    if (!(await MusicTools.Checkers(context))) {
      return;
    }

    if (!player.connected) {
      player.playerAuthor = context.author.id;
      await player.connect();
    }

    if (!(await MusicTools.sameVoice(context))) {
      return;
    }
    return;
  }
}
