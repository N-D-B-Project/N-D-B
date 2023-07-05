import NDBClient from "@/Client/NDBClient"
import { SubCommandOptions } from "@/Types"
import { BaseSubCommand } from "@/Utils/Structures"
import {
  CommandInteraction,
  CommandInteractionOptionResolver
} from "discord.js"

export default class ReactionFetchCommand extends BaseSubCommand {
  constructor(client: NDBClient, ...args: any) {
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
    }
    super(client, options, args)
  }

  async run(
    client: NDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {}
}
