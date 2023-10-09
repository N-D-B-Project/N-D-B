import Music from "@/Modules/Music";
import { CommandOptions, INDBClient } from "@/Types";
import { BaseCommand, Context } from "@/Utils/Structures";

export default class PlayCommand extends BaseCommand {
  constructor(client: INDBClient) {
    const options: CommandOptions = {
      name: "Play",
      aliases: ["play", "p", "P"],
      description: "Search a Song and Play it on a Voice Channel",
      category: "🎵 Music",
      usage: "<query>",
      disable: false,
      cooldown: 0,
      permissions: {
        bot: ["Connect", "EmbedLinks", "DeafenMembers", "Speak"],
        user: ["Connect", "SendMessages"],
        guildOnly: false,
        ownerOnly: false
      },
      minArgs: 1,
      maxArgs: 1000,
      nsfw: false,
      ndcash: 0,
      DM: false,
      slash: {
        type: "Sub",
        name: "play"
      }
    };
    super(client, options);
  }

  async run(context: Context) {
    const music = new Music(context.client);
    const play = await music.Play(context);
    context.reply(play);
  }
}
