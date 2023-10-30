import Music from "@/Modules/Music";
import { CommandOptions, INDBClient } from "@/Types";
import { BaseCommand, Context } from "@/Utils/Structures";

export default class StopCommand extends BaseCommand {
  constructor(client: INDBClient) {
    const options: CommandOptions = {
      name: "stop",
      aliases: ["parar"],
      description: "Stops the music queue",
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
      nsfw: false,
      ndcash: 0,
      DM: false,
      slash: {
        type: "Sub",
        name: "stop"
      }
    };
    super(client, options);
  }

  async run(context: Context) {
    const music = new Music();
    context.reply(await music.Stop(context));
  }
}
