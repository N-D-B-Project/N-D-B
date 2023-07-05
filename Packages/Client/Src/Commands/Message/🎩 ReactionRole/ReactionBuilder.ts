import NDBClient from "@/Client/NDBClient"
import { CommandOptions } from "@/Types"
import { BaseCommand } from "@/Utils/Structures"
import { EmbedBuilder, Message } from "discord.js"

export default class ReactionRoleBuilderCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
    const options: CommandOptions = {
      name: "reactionbuilder",
      aliases: [""],
      description: "Inicia a criação de uma Reaction Role",
      category: "🎩 ReactionRole",
      usage: "",
      disable: true,
      cooldown: 0,
      permissions: {
        user: ["SendMessages", "AddReactions", "ManageRoles"],
        bot: ["EmbedLinks", "AddReactions", "ManageRoles"]
      },
      minArgs: 0,
      maxArgs: 0,
      guildOnly: false,
      ownerOnly: false,
      nsfw: false,
      ndcash: 0,
      DM: false
    }
    super(client, options, args)
  }

  async run(client: NDBClient, message: Message, args: Array<string>) {
    const cancelEmbed = new EmbedBuilder()
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL()
      })
      .setColor("#c20e00")
    const cancelEmbed2 = new EmbedBuilder()
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL()
      })
      .setColor("#c20e00")
    const timeEmbed = new EmbedBuilder()
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL()
      })
      .setColor("#c20e00")
  }
}
