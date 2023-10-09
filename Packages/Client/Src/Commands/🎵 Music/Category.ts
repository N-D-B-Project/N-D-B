import { CommandOptions, INDBClient } from "@/Types";
import { Localization } from "@/Utils/Languages/Localization/Music";
import { BaseCommand, Context } from "@/Utils/Structures";
import { CommandChecker } from "@/Utils/Tools";
import { ApplicationCommandOptionType } from "discord.js";

export default class MusicCategoryCommand extends BaseCommand {
  constructor(client: INDBClient) {
    const options: CommandOptions = {
      name: "_Category",
      aliases: [],
      description: "",
      usage: "",
      category: "🎵 Music",
      permissions: {
        bot: ["Connect", "EmbedLinks", "DeafenMembers", "Speak"],
        user: ["Connect", "SendMessages"],
        ownerOnly: false
      },
      disable: false,
      cooldown: 0,
      ndcash: 0,
      slash: {
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
                  nameLocalizations:
                    Localization.options.play.options.query.name,
                  description: "<URL or Name> of the Music or Playlist",
                  descriptionLocalizations:
                    Localization.options.play.options.query.description,
                  type: ApplicationCommandOptionType.String,
                  required: true
                }
              ]
            },
            {
              name: "now_playing",
              nameLocalizations: Localization.options.nowplaying.name,
              description: "Show the current playing song and more info",
              descriptionLocalizations:
                Localization.options.nowplaying.description,
              type: ApplicationCommandOptionType.Subcommand
            },
            {
              name: "join",
              nameLocalizations: Localization.options.join.name,
              description:
                "The bot enter in you voice channel and initialize an player",
              descriptionLocalizations: Localization.options.join.description,
              type: ApplicationCommandOptionType.Subcommand
            }
          ]
        },
        deployMode: "Test",
        type: "Main"
      }
    };
    super(client, options);
  }

  async run(context: Context) {
    const SubList = [{ prop: "play" }, { prop: "now_playing" }];
    const cmdTools = new CommandChecker();
    await cmdTools.runSubCommand(context, SubList, false);
  }
}
