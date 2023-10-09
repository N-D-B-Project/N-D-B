/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandOptions, INDBClient } from "@/Types";
import { BaseCommand, Context } from "@/Utils/Structures";
import { EmbedBuilder } from "discord.js";

export default class ReactionRoleBuilderCommand extends BaseCommand {
  constructor(client: INDBClient) {
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
        bot: ["EmbedLinks", "AddReactions", "ManageRoles"],
        guildOnly: false,
        ownerOnly: false
      },
      minArgs: 0,
      maxArgs: 0,
      nsfw: false,
      ndcash: 0,
      DM: false
    };
    super(client, options);
  }

  async run(context: Context) {
    const cancelEmbed = new EmbedBuilder()
      .setAuthor({
        name: context.author.tag,
        iconURL: context.author.displayAvatarURL()
      })
      .setColor("#c20e00");
    const cancelEmbed2 = new EmbedBuilder()
      .setAuthor({
        name: context.author.tag,
        iconURL: context.author.displayAvatarURL()
      })
      .setColor("#c20e00");
    const timeEmbed = new EmbedBuilder()
      .setAuthor({
        name: context.author.tag,
        iconURL: context.author.displayAvatarURL()
      })
      .setColor("#c20e00");
  }
}
