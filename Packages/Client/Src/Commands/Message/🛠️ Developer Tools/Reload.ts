import NDBClient from "@/Client/NDBClient"
import { CommandOptions } from "@/Types"
import { CommandHandler, EventHandler, SubHandler } from "@/Utils/Handlers"
import SlashHandler from "@/Utils/Handlers/SlashHandler"
import { BaseCommand } from "@/Utils/Structures"
import { Message } from "discord.js"

export default class TestCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
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
        bot: ["SendMessages", "EmbedLinks"]
      },
      guildOnly: false,
      ownerOnly: true,
      nsfw: false,
      ndcash: 0
    }
    super(client, options, args)
  }

  async run(client: NDBClient, message: Message, args: Array<string>) {
    switch (args[0]) {
      case "events":
        client.removeAllListeners()
        await new EventHandler(client).load()
        break
      case "commands":
        await new CommandHandler(client).load()
        await new SlashHandler(client).load()
        await new SubHandler(client).load()
      case "all":
        client.removeAllListeners()
        await new EventHandler(client).load()
        await new CommandHandler(client).load()
        await new SlashHandler(client).load()
        await new SubHandler(client).load()
    }
  }
}
