import NDBClient from "@/Core/NDBClient";
import { SlashCommandOptions } from "@/Types";
import { Localization } from "@/Utils/Languages/Localization/Music";
import { BaseSlashCommand, BaseSubCommand } from "@/Utils/Structures";
import { SubTools } from "@/Utils/Tools";
import {
  ApplicationCommandOptionType,
  CommandInteraction,
  CommandInteractionOptionResolver
} from "discord.js";

export default class MusicCategoryCommand extends BaseSlashCommand {
  constructor(client: NDBClient, args: CommandInteractionOptionResolver) {
    const options: SlashCommandOptions = {
      data: {
        name: "music",
        nameLocalizations: Localization.name,
        description: "Category 🎵 Music",
        descriptionLocalizations: Localization.description,
        dmPermission: false,
        options: [
          {
            name: "play",
            nameLocalizations: Localization.options.play.name,
            description:
              "Search a Music or Playlist and Play it on a Voice Channel",
            descriptionLocalizations: Localization.options.play.description,
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: "query",
                nameLocalizations: Localization.options.play.options.query.name,
                description: "<URL or Name> of the Music or Playlist",
                descriptionLocalizations:
                  Localization.options.play.options.query.description,
                type: ApplicationCommandOptionType.String,
                required: true
              }
            ]
          }
        ]
      },
      category: "🎵 Music",
      permissions: {
        bot: ["Connect", "EmbedLinks", "DeafenMembers", "Speak"],
        user: ["Connect", "SendMessages"]
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
    const SubList = [{ prop: "play" }];
    for (const Command of SubList) {
      if (args.getSubcommand() === Command.prop) {
        const _SubCommand: BaseSubCommand = client.Collections.SubCommands.get(
          `${Command.prop}${this.options.category}`
        );

        if (_SubCommand) {
          const Checker = await cmdTools.runCheck(interaction, _SubCommand);
          if (Checker) {
            await interaction.deferReply();

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
