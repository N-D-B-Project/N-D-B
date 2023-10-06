import { CommandOptions, INDBClient } from "@/Types";
import { BaseCommand, Context } from "@/Utils/Structures";
import { CommandChecker } from "@/Utils/Tools";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType
} from "discord.js";

export default class DMCategoryCommand extends BaseCommand {
  public constructor(client: INDBClient) {
    const options: CommandOptions = {
      name: "_Category",
      category: "🛠️ Developer Tools",
      aliases: [],
      description: "",
      usage: "",
      permissions: {
        bot: ["Connect", "EmbedLinks", "DeafenMembers", "Speak"],
        user: ["Connect", "SendMessages"],
        ownerOnly: true
      },
      disable: false,
      cooldown: 0,
      ndcash: 0,
      slash: {
        data: {
          name: "dm",
          description: "Category 📨 DM",
          type: ApplicationCommandType.ChatInput,
          dmPermission: true,
          options: [
            {
              name: "clear_dm",
              description: "Clear the bot's message in your DM",
              type: ApplicationCommandOptionType.Subcommand
            }
          ]
        },
        deployMode: "Global",
        type: "Main"
      }
    };
    super(client, options);
  }

  public async run(client: INDBClient, context: Context) {
    const SubList = [{ prop: "clear_dm" }];
    const cmdTools = new CommandChecker(client);
    await cmdTools.runSubCommand(context, SubList, this.options);
  }
}
