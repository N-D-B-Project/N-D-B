import Music from "@/Modules/Music";
import { CommandOptions, INDBClient } from "@/Types";
import { BaseCommand, Context } from "@/Utils/Structures";

export default class LeaveCommand extends BaseCommand {
  public constructor(protected client: INDBClient) {
    const options: CommandOptions = {
      name: "leave",
      aliases: ["sair"],
      description: "Disconnect's the bot from Voice Channel",
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
        name: "leave"
      }
    };
    super(client, options);
  }

  public async run(context: Context) {
    const music = new Music();
    const leave = await music.Leave(context);
    return context.reply(leave);
  }
}
