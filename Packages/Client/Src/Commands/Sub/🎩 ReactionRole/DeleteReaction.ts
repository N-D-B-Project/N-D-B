import NDBClient from "@Client/NDBClient";
import { SubCommandOptions } from "~/Types";
import { BaseSubCommand } from "@Utils/Structures";
import { InteractionTools } from "@Utils/Tools";
import { Emojis } from "~/Config/Config";
import ReactionRole from "~/Packages/ReactionRole";
import {
  EmbedBuilder,
  CommandInteraction,
  CommandInteractionOptionResolver,
} from "discord.js";

export default class DeleteReactionCommand extends BaseSubCommand {
  constructor(client: NDBClient, ...args: any) {
    const options: SubCommandOptions = {
      name: "delete",
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

  async run(
    client: NDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {}
}
