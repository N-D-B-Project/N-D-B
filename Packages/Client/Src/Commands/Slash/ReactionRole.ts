import NDBClient from "@/Core/NDBClient";
import { SlashCommandOptions } from "@/Types";
import { Localization } from "@/Utils/Languages/Localization/ReactionRole";
import { BaseSlashCommand, BaseSubCommand } from "@/Utils/Structures";
import { SubTools } from "@/Utils/Tools";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import {
  CommandInteraction,
  CommandInteractionOptionResolver
} from "discord.js";

export default class ReactionRoleCategoryCommand extends BaseSlashCommand {
  constructor(client: NDBClient, args: CommandInteractionOptionResolver) {
    const options: SlashCommandOptions = {
      data: {
        name: "reactionrole",
        nameLocalizations: Localization.name,
        description: "Category 🎩 ReactionRole",
        descriptionLocalizations: Localization.description,
        dmPermission: false,
        options: [
          {
            name: "create",
            nameLocalizations: Localization.options.create.name,
            description: "Create a ReactionRole in the server",
            descriptionLocalizations: Localization.options.create.description,
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: "channel",
                nameLocalizations:
                  Localization.options.create.options.channel.name,
                description: "Channel where the ReactionRole will be created",
                descriptionLocalizations:
                  Localization.options.create.options.channel.description,
                type: ApplicationCommandOptionType.Channel,
                required: true
              },
              {
                name: "message",
                nameLocalizations:
                  Localization.options.create.options.message.name,
                description: "Message ID where the member will react",
                descriptionLocalizations:
                  Localization.options.create.options.message.description,
                type: ApplicationCommandOptionType.String,
                required: true
              },
              {
                name: "role",
                nameLocalizations:
                  Localization.options.create.options.role.name,
                description: "Role to be used in ReactionRole",
                descriptionLocalizations:
                  Localization.options.create.options.role.description,
                type: ApplicationCommandOptionType.Role,
                required: true
              },
              {
                name: "emoji",
                nameLocalizations:
                  Localization.options.create.options.emoji.name,
                description: "Emoji to be used in ReactionRole",
                descriptionLocalizations:
                  Localization.options.create.options.emoji.description,
                type: ApplicationCommandOptionType.String,
                required: true
              },
              {
                name: "type",
                nameLocalizations:
                  Localization.options.create.options.type.name,
                description: "ReactionRole Type (1-6) (/ReactionTypes)",
                descriptionLocalizations:
                  Localization.options.create.options.type.description,
                type: ApplicationCommandOptionType.Number,
                required: true
              }
            ]
          },
          {
            name: "delete",
            nameLocalizations: Localization.options.delete.name,
            description: "Delete",
            descriptionLocalizations: Localization.options.delete.description,
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: "channel",
                nameLocalizations:
                  Localization.options.delete.options.channel.name,
                description: "Channel where the ReactionRole is located",
                descriptionLocalizations:
                  Localization.options.delete.options.channel.description,
                type: ApplicationCommandOptionType.Channel,
                required: true
              },
              {
                name: "message",
                nameLocalizations:
                  Localization.options.delete.options.message.name,
                description: "Message ID used in ReactionRole",
                descriptionLocalizations:
                  Localization.options.delete.options.message.description,
                type: ApplicationCommandOptionType.String,
                required: true
              },
              {
                name: "role",
                nameLocalizations:
                  Localization.options.delete.options.role.name,
                description: "Role used in ReactionRole",
                descriptionLocalizations:
                  Localization.options.delete.options.role.description,
                type: ApplicationCommandOptionType.Role,
                required: true
              },
              {
                name: "emoji",
                nameLocalizations:
                  Localization.options.delete.options.emoji.name,
                description: "Emoji used in ReactionRole",
                descriptionLocalizations:
                  Localization.options.delete.options.emoji.description,
                type: ApplicationCommandOptionType.String,
                required: true
              }
            ]
          },
          {
            name: "edit",
            nameLocalizations: Localization.options.edit.name,
            description: "Edit a ReactionRole",
            descriptionLocalizations: Localization.options.edit.description,
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: "channel",
                nameLocalizations:
                  Localization.options.edit.options.channel.name,
                description: "Channel where the ReactionRole is located",
                descriptionLocalizations:
                  Localization.options.edit.options.channel.description,
                type: ApplicationCommandOptionType.Channel,
                required: true
              },
              {
                name: "message",
                nameLocalizations:
                  Localization.options.edit.options.message.name,
                description: "Message ID used in ReactionRole",
                descriptionLocalizations:
                  Localization.options.edit.options.message.description,
                type: ApplicationCommandOptionType.String,
                required: true
              },
              {
                name: "role",
                nameLocalizations: Localization.options.edit.options.role.name,
                description: "Role used in ReactionRole",
                descriptionLocalizations:
                  Localization.options.edit.options.role.description,
                type: ApplicationCommandOptionType.Role,
                required: true
              },
              {
                name: "new_role",
                nameLocalizations:
                  Localization.options.edit.options.newRole.name,
                description: "New role to be used in ReactionRole",
                descriptionLocalizations:
                  Localization.options.edit.options.role.description,
                type: ApplicationCommandOptionType.Role,
                required: true
              },
              {
                name: "emoji",
                nameLocalizations: Localization.options.edit.options.emoji.name,
                description: "Emoji used in ReactionRole",
                descriptionLocalizations:
                  Localization.options.edit.options.emoji.description,
                type: ApplicationCommandOptionType.String,
                required: true
              }
            ]
          },
          {
            name: "fetch",
            nameLocalizations: Localization.options.fetch.name,
            description: "Find the list of ReactionRoles on the server",
            descriptionLocalizations: Localization.options.fetch.description,
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: "type",
                nameLocalizations: Localization.options.fetch.options.type.name,
                description: "Type of Fetch",
                descriptionLocalizations:
                  Localization.options.fetch.options.type.description,
                required: true,
                type: ApplicationCommandOptionType.String,
                autocomplete: true
              }
            ]
          },
          {
            name: "delete_all",
            nameLocalizations: Localization.options.deleteall.name,
            description: "Find the list of ReactionRoles on the server",
            descriptionLocalizations:
              Localization.options.deleteall.description,
            type: ApplicationCommandOptionType.Subcommand
          },
          {
            name: "types",
            nameLocalizations: Localization.options.types.name,
            description: "Find the list of ReactionRoles on the server",
            descriptionLocalizations: Localization.options.types.description,
            type: ApplicationCommandOptionType.Subcommand
          }
        ]
      },
      category: "🎩 ReactionRole",
      permissions: {
        bot: ["ManageRoles", "AddReactions", "EmbedLinks", "SendMessages"],
        user: ["ManageRoles", "AddReactions", "SendMessages"]
      },
      deployMode: "Test",
      ownerOnly: false,
      disable: false,
      cooldown: 0,
      ndcash: 0
    };
    super(client, options, args);
  }

  async run(
    client: NDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {
    const cmdTools = new SubTools(client);
    const SubList = [
      { prop: "create" },
      { prop: "delete" },
      { prop: "edit" },
      { prop: "fetch" },
      { prop: "types" },
      { prop: "delete_all" }
    ];
    for (const Command of SubList) {
      if (args.getSubcommand() === Command.prop) {
        const _SubCommand: BaseSubCommand = client.Collections.SubCommands.get(
          `${Command.prop}${this.options.category}`
        );

        if (_SubCommand) {
          const Checker = await cmdTools.runCheck(interaction, _SubCommand);
          if (Checker) {
            _SubCommand
              .run(
                client,
                interaction,
                interaction.options as CommandInteractionOptionResolver
              )
              .catch(async (error: Error) => {
                client.logger.error(error.stack);
                return;
              });
          }
        }
      }
    }
  }
}
