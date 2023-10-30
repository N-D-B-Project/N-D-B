import Music from "@/Modules/Music";
import { CommandOptions, INDBClient } from "@/Types";
import { BaseCommand, Context } from "@/Utils/Structures";

export default class NowPlayingCommand extends BaseCommand {
  constructor(client: INDBClient) {
    const options: CommandOptions = {
      name: "NowPlaying",
      aliases: ["nowplaying", "np", "NP"],
      description: "",
      category: "🎵 Music",
      usage: "",
      disable: false,
      cooldown: 0,
      permissions: {
        bot: ["Connect", "EmbedLinks", "DeafenMembers", "Speak"],
        user: ["Connect", "SendMessages"],
        guildOnly: false,
        ownerOnly: false
      },
      minArgs: 0,
      maxArgs: 0,
      nsfw: false,
      ndcash: 0,
      DM: false,
      slash: {
        type: "Sub",
        name: "now_playing"
      }
    };
    super(client, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(context: Context) {
    const music = new Music();
    const nowplaying = await music.NowPlaying(context);
    await context.reply(nowplaying);
  }
}
