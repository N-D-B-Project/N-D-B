import Music from "@/Modules/Music";
import { SubCommandOptions } from "@/Types";
import { BaseSubCommand } from "@/Utils/Structures";
import {
  CommandInteraction,
  CommandInteractionOptionResolver
} from "discord.js";

export default class JoinCommand extends BaseSubCommand {
  constructor(client: INDBClient, args: CommandInteractionOptionResolver) {
    const options: SubCommandOptions = {
      name: "join",
      category: "🎵 Music",
      disable: false,
      cooldown: 0,
      permissions: {
        bot: ["SendMessages"],
        user: ["SendMessages"]
      },
      ownerOnly: false,
      nsfw: false,
      ndcash: 0,
      deployMode: "Test"
    };
    super(client, options, args);
  }

  async run(
    client: INDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver,
    premium: boolean
  ) {
    await new Music(client).Join({ MsgInt: interaction }, false, premium);
  }
}
