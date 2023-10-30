import { Context } from "@/Utils/Structures";
import { MultiCommandList } from "../Types";
import MusicTools from "./Tools";

export default class Multi {
  public static async run(
    context: Context,
    command: MultiCommandList
  ): Promise<string> {
    const player = await MusicTools.getPlayer(context);
    switch (command.toString()) {
      case "skip":
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
      case "shuffle":
        if (!player.isShuffle) {
          player.originalQueue = player.queue;
        }
        player.queue.shuffle();
        player.isShuffle = true;
        return;

      case "unshuffle":
        player.queue.utils.destroy();
        player.queue.add(player.originalQueue.tracks);
        player.isShuffle = false;
        return;

      case "loop":
        return;
    }
  }
}
