import Music from "@/Modules/Music";
import { CommandOptions, INDBClient } from "@/Types";
import { BaseCommand, Context } from "@/Utils/Structures";

export default class QueueCommand extends BaseCommand {
  public constructor(protected client: INDBClient) {
    const options: CommandOptions = {
      name: "queue",
      aliases: [""],
      description: "Shows the music Queue",
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
        name: "queue"
      }
    };
    super(client, options);
  }

  public async run(context: Context) {
    const music = new Music();
    await music.Queue(context);
  }
}
