import NDBClient from "@Client/NDBClient";
import { CommandOptions } from "~/Types";
import { HelpCommandTools, InteractionTools, MessageTools } from "@Utils/Tools";
import BaseCommand from "@Structures/BaseCommand";
import * as Discord from "discord.js";

export default class HelpCommand extends BaseCommand {
  public constructor(client: NDBClient, ...args: any[]) {
    const options: CommandOptions = {
      name: "help",
      aliases: ["ajuda", "halp"],
      description: "Mostra todos os comandos e como utilizar-los",
      category: "🌐 Accessibility",
      usage: "[Comando]",
      userPerms: ["SEND_MESSAGES", "USE_APPLICATION_COMMANDS"],
      botPerms: ["EMBED_LINKS"],
      ownerOnly: false,
      SlashOptions: {
        name: "help",
        description: "show all commands and how to use them",
        ephemeral: true,
        options: [
          {
            name: "command",
            description: "show the help of a command",
            type: "STRING",
          },
        ],
      },
    };
    super(client, options, args);
  }

  async run(client: NDBClient, message: Discord.Message, [command]) {
    const cmd =
      client.Collections.commands.get(command) ||
      client.Collections.commands.get(client.Collections.aliases.get(command));
    if (command) {
      if (!cmd) {
        await MessageTools.reply(message, {
          content: `${await client.translate(
            "🌐 Accessibility/help:Command:Invalid",
            message,
            {
              CMD: command,
            }
          )}`,
        });
        return;
      }
    } else {
      const Tools = new HelpCommandTools(client);
      await Tools.Run(message, "message", cmd);
    }
  }

  async SlashRun(
    client: NDBClient,
    interaction: Discord.CommandInteraction,
    args: Discord.CommandInteractionOptionResolver
  ) {
    const command = args.getString("command");
    const cmd = client.Collections.SlashCommands.get(String(command));
    if (command) {
      if (!cmd) {
        await InteractionTools.reply(interaction, {
          content: `${await client.translate(
            "🌐 Accessibility/help:Command:Invalid",
            interaction,
            {
              CMD: command,
            }
          )}`,
        });
        return;
      }
    } else {
      const Tools = new HelpCommandTools(client);
      await Tools.Run(interaction, "interaction", cmd);
    }
  }
}
