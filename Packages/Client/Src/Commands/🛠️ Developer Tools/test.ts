/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandOptions, INDBClient } from "@/Types";
import { BaseCommand } from "@/Utils/Structures";
import Context from "@/Utils/Structures/Context";

export default class TestCommand extends BaseCommand {
  constructor(client: INDBClient) {
    const options: CommandOptions = {
      name: "test",
      aliases: ["t"],
      description: "Command to test things",
      category: "🛠 Developer Tools",
      usage: "",
      disable: false,
      cooldown: 1000,
      permissions: {
        user: [],
        bot: [],
        guildOnly: false,
        ownerOnly: true
      },
      minArgs: 0,
      nsfw: false,
      ndcash: 0,
      slash: {
        type: "Sub"
      }
    };
    super(client, options);
  }

  async run(context: Context) {
    console.log(`TestCommand: ${context.getArg("test", 0)}`);
  }
}
