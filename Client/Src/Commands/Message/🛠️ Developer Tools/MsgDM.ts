import NDBClient from "@Client/NDBClient";
import { CommandOptions } from "~/Types";
import { MessageTools, InteractionTools } from "@Utils/Tools";
import { BaseCommand } from "@Utils/Structures";
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  Message,
} from "discord.js";

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
        user: ["SendMessages"],
      },
      minArgs: 0,
      maxArgs: 0,
      guildOnly: false,
      ownerOnly: true,
      nsfw: false,
      ndcash: 0,
      DM: true,
    };
    super(client, options, args);
  }

  async run(client: NDBClient, message: Message, args: Array<string>) {
    MessageTools.send(message.channel, { content: "Message 1" });
    MessageTools.send(message.channel, { content: "Message 2" });
    MessageTools.send(message.channel, { content: "Message 3" });
    MessageTools.send(message.channel, { content: "Message 4" });
    MessageTools.send(message.channel, { content: "Message 5" });
  }
}
