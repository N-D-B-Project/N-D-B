import Music from "@/Modules/Music";
import { CommandOptions, INDBClient } from "@/Types";
import { BaseCommand, Context } from "@/Utils/Structures";

export default class JoinCommand extends BaseCommand {
  constructor(client: INDBClient) {
    const options: CommandOptions = {
      name: "join",
      aliases: ["Join"],
      description: "Join's a voice channel",
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
      DM: false
    };
    super(client, options);
  }

  async run(context: Context) {
    await new Music(context.client).Join(context);
  }
}
