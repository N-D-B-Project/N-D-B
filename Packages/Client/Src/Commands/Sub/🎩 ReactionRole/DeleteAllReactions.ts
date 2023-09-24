/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactionRole from "@/Modules/ReactionRole";
import {
  ReactionRoleDeleteAllEmbed,
  UnableToDeleteReactionRoleEmbed
} from "@/Modules/ReactionRole/Utils/Embeds";
import { INDBClient, SubCommandOptions } from "@/Types";
import { mixedComponentType } from "@/Types/extends";
import { BaseSubCommand } from "@/Utils/Structures";
import { Buttons, InteractionTools } from "@/Utils/Tools";
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  ComponentType
} from "discord.js";

export default class DeleteAllReactionsCommand extends BaseSubCommand {
  constructor(client: INDBClient, args: CommandInteractionOptionResolver) {
    const options: SubCommandOptions = {
      name: "delete_all",
      category: "🎩 ReactionRole",
      disable: false,
      cooldown: 0,
      permissions: {
        user: [
          "SendMessages",
          "UseApplicationCommands",
          "AddReactions",
          "ManageRoles"
        ],
        bot: ["EmbedLinks", "AddReactions", "ManageRoles"]
      },
      ownerOnly: false,
      nsfw: false,
      ndcash: 0,
      deployMode: "Test"
    };
    super(client, options, args);
  }

  async run(
    client: INDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {
    const reaction = new ReactionRole(client, "DeleteAll");
    const button = await new Buttons(client).Confirm(interaction);
    const confirm = await InteractionTools.reply(
      interaction,
      {
        embeds: [
          await ReactionRoleDeleteAllEmbed(
            client,
            interaction,
            interaction.user,
            "Confirm",
            null
          )
        ],
        components: [button as mixedComponentType]
      },
      false
    );
    confirm
      .createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 10 * 1000
      })
      .on("collect", async collector => {
        if (collector.user.id !== interaction.user.id) return;
        if (collector.customId === "YES") {
          const { count, status } = await reaction.DeleteAll(interaction.guild);

          if (status === "Deleted") {
            InteractionTools.editReply(interaction, {
              embeds: [
                await ReactionRoleDeleteAllEmbed(
                  client,
                  interaction,
                  interaction.user,
                  "Success",
                  count
                )
              ],
              components: []
            });
          } else if (status === "UnableToDelete") {
            InteractionTools.editReply(interaction, {
              embeds: [
                await UnableToDeleteReactionRoleEmbed(
                  client,
                  interaction,
                  interaction.user,
                  confirm
                )
              ],
              components: []
            });
          }
        } else if (collector.customId === "NO") {
          InteractionTools.editReply(interaction, {
            embeds: [
              await ReactionRoleDeleteAllEmbed(
                client,
                interaction,
                interaction.user,
                "Confirm",
                null
              )
            ],
            components: []
          });
        }
      })
      .on("end", async () => {
        return;
      });
  }
}
