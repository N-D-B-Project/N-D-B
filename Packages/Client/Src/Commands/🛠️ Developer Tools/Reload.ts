import { CommandOptions, INDBClient } from "@/Types";
import { CommandHandler, EventHandler } from "@/Utils/Handlers";
import { BaseCommand, Context } from "@/Utils/Structures";

export default class TestCommand extends BaseCommand {
  constructor(client: INDBClient) {
    const options: CommandOptions = {
      name: "reload",
      aliases: ["reiniciar"],
      description: "Reload all handlers",
      category: "🛠 Developer Tools",
      usage: "",
      disable: false,
      cooldown: 1000,
      permissions: {
        user: ["SendMessages"],
        bot: ["SendMessages", "EmbedLinks"],
        guildOnly: false,
        ownerOnly: true
      },
      nsfw: false,
      ndcash: 0,
      slash: {
        type: "Sub"
      }
    };
    super(client, options);
  }

  async run(client: INDBClient, context: Context) {
    switch (context.getArg("reload", 0)) {
      case "events":
        client.removeAllListeners();
        await new EventHandler(client).load();
        break;
      case "commands":
        client.Collections.Commands.clear();
        client.Collections.SubCommands.clear();
        client.Collections.SlashCommands.clear();
        await new CommandHandler(client).load();
      case "all":
        client.removeAllListeners();
        await new EventHandler(client).load();
        await new CommandHandler(client).load();
    }
  }
}
