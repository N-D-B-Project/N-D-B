import { Context } from "@/Utils/Structures";
import MusicTools from "./Tools";

export default class Stop {
  public static async run(context: Context) {
    const player = await MusicTools.getPlayer(context);
    if (!(await MusicTools.Checkers(context))) return;
    await player.destroy();
    return await context.client.Translate.Guild("Tools/Music:Stop", context);
  }
}
