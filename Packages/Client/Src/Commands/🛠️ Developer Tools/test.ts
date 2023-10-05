/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandOptions, INDBClient } from "@/Types";
import { BaseCommand } from "@/Utils/Structures";
import Context from "@/Utils/Structures/Context";
import { ApplicationCommandOptionType } from "discord.js";

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
        data: {
          name: "test",
          description: "test",
          options: [
            {
              name: "test",
              type: ApplicationCommandOptionType.String,
              description: "test"
            }
          ]
        },
        deployMode: "Test",
        type: "Main"
      }
    };
    super(client, options);
  }

  async run(client: INDBClient, context: Context, premium: boolean) {
    console.log(context.getArg("test", 0));
  }
}
