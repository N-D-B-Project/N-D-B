import NDBClient from "@Client/NDBClient";
import { SubCommandOptions } from "~/Types";
import { InteractionTools, Buttons } from "@Utils/Tools";
import { ReactionRole } from "~/Packages";
import { Emojis } from "~/Config/Config";
import { BaseSubCommand } from "@Utils/Structures";
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
} from "discord.js";

export default class ReactionFetchCommand extends BaseSubCommand {
  constructor(client: NDBClient, ...args: any) {
    const options: SubCommandOptions = {
      name: "fetch",
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
