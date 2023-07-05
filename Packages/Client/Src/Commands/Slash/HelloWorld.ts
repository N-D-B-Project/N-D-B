import NDBClient from "@/Client/NDBClient"
import { SlashCommandOptions } from "@/Types"
import { BaseSlashCommand } from "@/Utils/Structures"
import { InteractionTools } from "@/Utils/Tools"
import {
  CommandInteraction,
  CommandInteractionOptionResolver
} from "discord.js"

export default class Command extends BaseSlashCommand {
  constructor(client: NDBClient, ...args: any) {
    const options: SlashCommandOptions = {
      data: {
        name: "helloworld",
        description: "A Simple Hello"
      },
      category: "Any",
      permissions: {
        user: ["SendMessages"],
        bot: ["SendMessages"]
      },
      deployMode: "Global"
    }
    super(client, options, args)
  }

  async run(
    client: NDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {
    InteractionTools.reply(
      interaction,
      { content: "Hello World! I'm N-D-B a simple Discord Bot" },
      true
    )
  }
}
