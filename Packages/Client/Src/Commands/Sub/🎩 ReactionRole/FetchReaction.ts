/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { INDBClient, SubCommandOptions } from "@/Types";
import { BaseSubCommand } from "@/Utils/Structures";
import {
  CommandInteraction,
  CommandInteractionOptionResolver
} from "discord.js";

export default class ReactionFetchCommand extends BaseSubCommand {
  constructor(client: INDBClient, args: CommandInteractionOptionResolver) {
    const options: SubCommandOptions = {
      name: "fetch",
      category: "🎩 ReactionRole",
      disable: false,
      cooldown: 0,
      permissions: {
        user: ["SendMessages", "UseApplicationCommands", "ManageRoles"],
        bot: ["EmbedLinks", "AddReactions", "ManageRoles"]
      },
      deployMode: "Test",
      ownerOnly: false,
      nsfw: false,
      ndcash: 0
    };
    super(client, options, args);
  }

  async run(
    client: INDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {}
}
