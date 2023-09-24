import ReactionRole from "@/Modules/ReactionRole";
import {
  ReactionRoleDeleteAllEmbed,
  UnableToDeleteReactionRoleEmbed
} from "@/Modules/ReactionRole/Utils/Embeds";
import { CommandOptions, INDBClient } from "@/Types";
import { mixedComponentType } from "@/Types/extends";
import { BaseCommand } from "@/Utils/Structures";
import { Buttons, MessageTools } from "@/Utils/Tools";
import { ComponentType, Message } from "discord.js";

export default class DeleteAllReactionsCommand extends BaseCommand {
  constructor(client: INDBClient, ...args: string[]) {
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
        bot: ["EmbedLinks", "AddReactions", "ManageRoles"]
      },
      minArgs: 0,
      maxArgs: 0,
      guildOnly: false,
      ownerOnly: false,
      nsfw: false,
      ndcash: 0,
      DM: false
    };
    super(client, options, args);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(client: INDBClient, message: Message, args: Array<string>) {
    const reaction = new ReactionRole(client, "DeleteAll");
    const button = await new Buttons(client).Confirm(message);
    const confirm = await MessageTools.send(message.channel, {
      embeds: [
        await ReactionRoleDeleteAllEmbed(
          client,
          message,
          message.author,
          "Confirm",
          null
        )
      ],
      components: [button as mixedComponentType]
    });
    confirm
      .createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 10 * 1000
      })
      .on("collect", async collector => {
        if (collector.user.id !== message.author.id) return;
        if (collector.customId === "YES") {
          const { count, status } = await reaction.DeleteAll(message.guild);

          if (status === "Deleted") {
            MessageTools.edit(confirm, {
              embeds: [
                await ReactionRoleDeleteAllEmbed(
                  client,
                  message,
                  message.author,
                  "Success",
                  count
                )
              ],
              components: []
            });
          } else if (status === "UnableToDelete") {
            MessageTools.edit(confirm, {
              embeds: [
                await UnableToDeleteReactionRoleEmbed(
                  client,
                  message,
                  message.author,
                  message
                )
              ],
              components: []
            });
          }
        } else if (collector.customId === "NO") {
          MessageTools.edit(confirm, {
            embeds: [
              await ReactionRoleDeleteAllEmbed(
                client,
                message,
                message.author,
                "Cancel",
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
