import { CommandOptions, INDBClient } from "@/Types";
import { BaseCommand, Context } from "@/Utils/Structures";
import { CommandChecker } from "@/Utils/Tools";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType
} from "discord.js";

export default class DeveloperToolsCategoryCommand extends BaseCommand {
  constructor(client: INDBClient) {
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
          name: "developer_tools",
          description: "Category 🛠️ Developer Tools",
          type: ApplicationCommandType.ChatInput,
          options: [
            {
              name: "eval",
              description:
                "Evaluate some codes to test it without restart the bot every time",
              type: ApplicationCommandOptionType.Subcommand,
              options: [
                {
                  name: "code",
                  description: "Code to begin evaluated",
                  type: ApplicationCommandOptionType.String
                }
              ]
            },
            {
              name: "reload",
              description: "Reload the client (events | commands | all)",
              type: ApplicationCommandOptionType.Subcommand,
              options: [
                {
                  name: "type",
                  description: "Choose what will be reloaded",
                  type: ApplicationCommandOptionType.String,
                  choices: [
                    {
                      name: "events",
                      value: "events"
                    },
                    {
                      name: "commands",
                      value: "commands"
                    },
                    {
                      name: "all",
                      value: "all"
                    }
                  ]
                }
              ]
            },
            {
              name: "test",
              description: "test",
              type: ApplicationCommandOptionType.Subcommand,
              options: [
                {
                  name: "test",
                  type: ApplicationCommandOptionType.String,
                  description: "test"
                }
              ]
            }
          ]
        },
        deployMode: "Test",
        type: "Main"
      }
    };
    super(client, options);
  }

  async run(context: Context) {
    const SubList = [{ prop: "eval" }, { prop: "reload" }, { prop: "test" }];
    const cmdTools = new CommandChecker();
    await cmdTools.runSubCommand(context, SubList, false);
  }
}
