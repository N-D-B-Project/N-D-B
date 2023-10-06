/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandOptions, INDBClient } from "@/Types";
import { BaseCommand, Context } from "@/Utils/Structures";

export default class Command extends BaseCommand {
  public constructor(client: INDBClient) {
    const options: CommandOptions = {
      name: "_Category",
      aliases: [],
      description: "",
      usage: "",
      category: "(/) Slash",
      permissions: {
        user: ["SendMessages"],
        bot: ["SendMessages"]
      },
      slash: {
        data: {
          name: "helloworld",
          description: "A Simple Hello"
        },
        deployMode: "Global",
        type: "Main"
      }
    };
    super(client, options);
  }

  public async run(client: INDBClient, context: Context) {
    context.reply({ content: "Hello World! I'm N-D-B a simple Discord Bot" });
  }
}
