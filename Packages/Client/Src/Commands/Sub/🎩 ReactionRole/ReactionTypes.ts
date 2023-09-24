/* eslint-disable @typescript-eslint/no-unused-vars */

import { INDBClient, SubCommandOptions } from "@/Types";
import { BaseSubCommand } from "@/Utils/Structures";
import { InteractionTools } from "@/Utils/Tools";
import {
  CommandInteraction,
  CommandInteractionOptionResolver
} from "discord.js";

export default class ReactionTypesCommand extends BaseSubCommand {
  constructor(client: INDBClient, args: CommandInteractionOptionResolver) {
    const options: SubCommandOptions = {
      name: "types",
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
  ) {
    InteractionTools.reply(
      interaction,
      await client.Translate.Guild(
        "ReactionRole/ReactionTypes:Types",
        interaction
      ),
      false
    );
  }
}
