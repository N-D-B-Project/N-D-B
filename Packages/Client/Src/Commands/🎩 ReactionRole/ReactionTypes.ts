/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandOptions, INDBClient } from "@/Types";
import { BaseCommand, Context } from "@/Utils/Structures";

export default class ReactionTypesCommand extends BaseCommand {
  constructor(client: INDBClient, ...args: string[]) {
    const options: CommandOptions = {
      name: "ReactionTypes",
      aliases: ["RTypes"],
      description: "Edita uma Reaction Role",
      category: "🎩 ReactionRole",
      usage: "",
      disable: false,
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
      DM: false,
      slash: {
        type: "Sub",
        name: "types"
      }
    };
    super(client, options);
  }

  async run(client: INDBClient, context: Context) {
    await context.send(
      await client.Translate.Guild("ReactionRole/ReactionTypes:Types", context)
    );
  }
}
