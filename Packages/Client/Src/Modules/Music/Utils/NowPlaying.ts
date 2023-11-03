import { Context } from "@/Utils/Structures";
import MusicEmbeds from "./Embeds";
import MusicTools from "./Tools";

export default class NowPlaying {
  public static async run(context: Context) {
    if (!(await MusicTools.Checkers(context))) {
      return;
    }
    const embeds = new MusicEmbeds(context.client);
    return context.reply(await embeds.NowPlaying(context));
  }
}
