import NDBClient from "@Client/NDBClient";
import { SubCommandOptions } from "~/Types";
import { InteractionTools, Buttons as BClass } from "@Utils/Tools";
import { ReactionRole } from "~/Packages";
import { GuildConfig as Schema } from "@Database/Schemas";
import { BaseSubCommand } from "@Utils/Structures";
import { Document } from "mongoose";
import {
  Message,
  EmbedBuilder,
  CommandInteraction,
  CommandInteractionOptionResolver,
  ComponentType,
} from "discord.js";

export default class WipeReactionCommand extends BaseSubCommand {
  constructor(client: NDBClient, ...args: any) {
    const options: SubCommandOptions = {
      name: "wipe",
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
