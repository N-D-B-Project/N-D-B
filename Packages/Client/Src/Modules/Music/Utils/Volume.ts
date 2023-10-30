import { Context } from "@/Utils/Structures";
import MusicTools from "./Tools";

export default class Volume {
  public static async run(context: Context) {
    const player = await MusicTools.getPlayer(context);
    if (!(await MusicTools.Checkers(context))) return;
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
