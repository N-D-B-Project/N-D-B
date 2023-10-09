/* eslint-disable no-shadow */

import { Context } from "@/Utils/Structures";
import { MultiCommandList } from "../Types";
import MusicTools from "./Tools";

export default class Multi {
  public static async run(
    context: Context,
    command: MultiCommandList
  ): Promise<string> {
    const player = await MusicTools.getPlayer(context);
    const VoiceChannel = (
      await context.guild.channels.fetch(player.voiceChannelId)
    ).name;
    switch (command) {
      case MultiCommandList.skip:
        const skipAmount = Number(context.getArg("skip_amount", 0)) || 0;
        var SkipSTR = "";
        if (skipAmount === 0) {
          SkipSTR = "Tools/Music:Skip:Current";
        } else {
          SkipSTR = "Tools/Music:Skip:Amount";
        }
        player.skip(skipAmount);
        return await context.client.Translate.Guild(SkipSTR, context, {
          skipAmount
        });
      case MultiCommandList.stop:
        player.destroy();
        return await context.client.Translate.Guild(
          "Tools/Music:Stop",
          context
        );

      case MultiCommandList.leave:
        player.disconnect();
        return await context.client.Translate.Guild(
          "Tools/Music:Leave",
          context,
          {
            VoiceChannel
          }
        );

      case MultiCommandList.pause:
        player.pause();
        return;

      case MultiCommandList.resume:
        player.resume();
        return;

      case MultiCommandList.shuffle:
        if (!player.isShuffle) {
          player.originalQueue = player.queue;
        }
        player.queue.shuffle();
        player.isShuffle = true;
        return;

      case MultiCommandList.unshuffle:
        player.queue.utils.destroy();
        player.queue.add(player.originalQueue.tracks);
        player.isShuffle = false;
        return;

      case MultiCommandList.loop:
        return;

      case MultiCommandList.volume:
        const volume = Number(context.getArg("volume", 0));
        if (!volume || volume < 1 || volume > 100) {
          return await context.client.Translate.Guild(
            "Tools/Music:Volume:NotValid",
            context
          );
        }

        player.setVolume(volume);
        return await context.client.Translate.Guild(
          "Tools/Music:Volume:Defined",
          context,
          {
            volume
          }
        );
    }
  }
}
