import { Context } from "@/Utils/Structures";
import MusicEmbeds from "./Embeds";
import MusicTools from "./Tools";

export default class NowPlaying {
  public static async run(context: Context) {
    if (!(await MusicTools.Checkers(context))) {
      return;
    }

    return context.reply(
      await new MusicEmbeds(context.client).NowPlaying(context)
    );
  }
}
