import { Context } from "@/Utils/Structures";
import MusicEmbeds from "./Embeds";
import MusicTools from "./Tools";

export default class NowPlaying {
  public static async _Legacy(context: Context) {
    const player = await MusicTools.getPlayer(context);
    if (!(await MusicTools.HasPlayer(player, context))) {
      return;
    }

    return context.reply(
      await new MusicEmbeds(context.client).NowPlaying(context)
    );
  }
}
