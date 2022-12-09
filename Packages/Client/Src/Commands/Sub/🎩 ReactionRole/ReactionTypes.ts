import NDBClient from "@Client/NDBClient";
import { SubCommandOptions } from "~/Types";
import { MessageTools, InteractionTools } from "@Utils/Tools";
import { BaseSubCommand } from "@Utils/Structures";
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  Message,
  EmbedBuilder,
} from "discord.js";

export default class ReactionTypesCommand extends BaseSubCommand {
  constructor(client: NDBClient, ...args: any) {
    const options: SubCommandOptions = {
      name: "types",
      category: "🎩 ReactionRole",
      disable: false,
      cooldown: 0,
      permissions: {
        user: ["SendMessages", "UseApplicationCommands", "ManageRoles"],
        bot: ["EmbedLinks", "AddReactions", "ManageRoles"],
      },
      guildOnly: false,
      ownerOnly: false,
      nsfw: false,
      ndcash: 0,
    };
    super(client, options, args);
  }

  async SlashRun(
    client: NDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {}
}
