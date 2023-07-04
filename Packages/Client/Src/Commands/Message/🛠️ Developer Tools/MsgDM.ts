import NDBClient from "@/Client/NDBClient"
import { CommandOptions } from "@/Types"
import { BaseCommand } from "@/Utils/Structures"
import { MessageTools } from "@/Utils/Tools"
import { Message } from "discord.js"

export default class MsgDMCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
    const options: CommandOptions = {
      name: "MsgDM",
      aliases: ["msgdm", "dmmsg"],
      description: "Envia 5 mensagens na DM",
      category: "🛠️ Developer Tools",
      usage: "",
      disable: false,
      cooldown: 0,
      permissions: {
        bot: ["SendMessages"],
        user: ["SendMessages"]
      },
      minArgs: 0,
      maxArgs: 0,
      guildOnly: false,
      ownerOnly: true,
      nsfw: false,
      ndcash: 0,
      DM: true
    }
    super(client, options, args)
  }

  async run(client: NDBClient, message: Message, args: Array<string>) {
    MessageTools.send(message.author, { content: "Message 1" })
    MessageTools.send(message.author, { content: "Message 2" })
    MessageTools.send(message.author, { content: "Message 3" })
    MessageTools.send(message.author, { content: "Message 4" })
    MessageTools.send(message.author, { content: "Message 5" })
  }
}
