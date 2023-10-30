import Music from "@/Modules/Music";
import { CommandOptions, INDBClient } from "@/Types";
import { BaseCommand, Context } from "@/Utils/Structures";

export default class PauseCommand extends BaseCommand {
  public constructor(protected client: INDBClient) {
    const options: CommandOptions = {
      name: "pause",
      aliases: ["pausar"],
      description: "Pauses the music Queue",
      category: "🎵 Music",
      usage: "",
      disable: false,
      cooldown: 0,
      permissions: {
        bot: ["SendMessages"],
        user: ["SendMessages"],
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
        name: "pause"
      }
    };
    super(client, options);
  }

  public async run(context: Context) {
    const music = new Music();
    const pause = await music.Pause(context);
    return context.reply(pause);
  }
}
