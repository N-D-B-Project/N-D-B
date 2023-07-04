import NDBClient from "@/Client/NDBClient";
import { CommandOptions } from "@/Types";
import { BaseCommand } from "@/Utils/Structures";
import { MessageTools } from "@/Utils/Tools";
import { Message } from "discord.js";

export default class ReactionTypesCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
    const options: CommandOptions = {
      name: "ReactionTypes",
      aliases: ["RTypes"],
      description: "Edita uma Reaction Role",
      category: "🎩 ReactionRole",
      usage: "",
      disable: false,
      cooldown: 0,
      permissions: {
        user: ["SendMessages", "UseApplicationCommands", "ManageRoles"],
        bot: ["EmbedLinks", "AddReactions", "ManageRoles"],
      },
      minArgs: 0,
      maxArgs: 0,
      guildOnly: false,
      ownerOnly: false,
      nsfw: false,
      ndcash: 0,
      DM: false,
    };
    super(client, options, args);
  }

  async run(client: NDBClient, message: Message, args: string[]) {
    await MessageTools.send(message.channel, await client.Translate.Guild("🎩 ReactionRole/ReactionTypes:Types", message))
  }
}
