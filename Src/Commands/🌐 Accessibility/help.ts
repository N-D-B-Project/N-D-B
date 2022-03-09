import NDBClient from "@Client/NDBClient";
import { CommandOptions } from "~/Types";
import { HelpCommandTools, MessageTools } from "@Utils/Tools";
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
      userPerms: ["SEND_interactionS"],
      botPerms: [""],
      ownerOnly: false,
      // SlashOptions: {
      //     name: "help",
      //     description: "Mostra todos os comandos e como utilizar-los",
      //     options: [
      //         {
      //             name: "comando",
      //             description: "Mostra as informações do comando escolhido",
      //             type: "STRING",
      //             required: false
      //         }
      //     ]
      // }
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
}
