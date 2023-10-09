import ReactionRole from "@/Modules/ReactionRole";
import {
  ReactionRoleDeleteAllEmbed,
  UnableToDeleteAllReactionRoleEmbed
} from "@/Modules/ReactionRole/Utils/Embeds";
import { CommandOptions, INDBClient } from "@/Types";
import { mixedComponentType } from "@/Types/extends";
import { BaseCommand, Context } from "@/Utils/Structures";
import { Buttons } from "@/Utils/Tools";
import { ComponentType } from "discord.js";

export default class DeleteAllReactionsCommand extends BaseCommand {
  constructor(client: INDBClient) {
    const options: CommandOptions = {
      name: "DeleteAllReactions",
      aliases: [""],
      description: "Remove todas as Reaction Roles do Servidor",
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
        name: "delete_all"
      }
    };
    super(client, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(context: Context) {
    const reaction = new ReactionRole(context.client, "DeleteAll");
    const button = await new Buttons(context.client).Confirm(context);
    const confirm = await context.send({
      embeds: [await ReactionRoleDeleteAllEmbed(context, "Confirm", null)],
      components: [button as mixedComponentType]
    });

    confirm
      .createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 10 * 1000
      })
      .on("collect", async collector => {
        if (collector.user.id !== context.author.id) return;
        if (collector.customId === "YES") {
          const { count, status } = await reaction.DeleteAll(context.guild);

          if (status === "Deleted") {
            context.edit({
              embeds: [
                await ReactionRoleDeleteAllEmbed(context, "Success", count)
              ],
              components: []
            });
          } else if (status === "UnableToDelete") {
            context.edit({
              embeds: [await UnableToDeleteAllReactionRoleEmbed(context)],
              components: []
            });
          }
        } else if (collector.customId === "NO") {
          context.edit({
            embeds: [await ReactionRoleDeleteAllEmbed(context, "Cancel", null)],
            components: []
          });
        }
      });
  }
}
