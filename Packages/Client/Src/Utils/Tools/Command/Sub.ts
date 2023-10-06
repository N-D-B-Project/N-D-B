import { CommandOptions, INDBClient } from "@/Types";
import { BaseCommand, Context } from "@/Utils/Structures";
import { CommandInteraction, TextChannel } from "discord.js";
import { InteractionTools, Tools } from "../index";

export default class SubChecker {
  public constructor(private client: INDBClient) {}

  private async runCheck(
    interaction: CommandInteraction,
    _Command: BaseCommand
  ): Promise<boolean> {
    const Options = _Command.options;
    const Channel = interaction.channel as TextChannel;
    const tools = new Tools(this.client);

    if (
      Options.permissions.ownerOnly &&
      !tools.checkOwner(interaction.user.id)
    ) {
      InteractionTools.reply(
        interaction,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:OwnerOnly",
          interaction
        ),
        true
      );
      return false;
    }

    if (
      Options.slash.deployMode === "Guild" &&
      !tools.checkGuild(interaction.guild.id)
    ) {
      InteractionTools.reply(
        interaction,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:GuildOnly",
          interaction
        ),
        true
      );
      return false;
    }
    if (Options.nsfw && !Channel.nsfw) {
      InteractionTools.reply(
        interaction,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:NSFW",
          interaction
        ),
        true
      );
      return false;
    }
    if (Options.disable) {
      InteractionTools.reply(
        interaction,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:Disable",
          interaction
        ),
        true
      );
      return false;
    }
    // if (Options.ndcash && !NDCash) {
    //   InteractionTools.reply(
    //     interaction,
    //     await this.client.Translate.Guild(
    //       "Tools/Command:Checker:NDCash",
    //       interaction
    //     )
    //   );
    //   return false;
    // }
    // if (Options.ndcash && NDCash) {
    //   NDCash -= Options.ndcash;
    //   UserProfile.save();
    //   return true;
    // }

    // const player = await MusicTools.getPlayer(this.client, interaction.guildId);
    // if (interaction.channelId !== player.textChannelId) {
    //   const voiceChannel = await interaction.guild.channels.fetch(
    //     player.voiceChannelId
    //   );

    //   await this.client.Translate.Guild(
    //     "Tools/Music:WrongChannel",
    //     interaction,
    //     {
    //       TextChannel: channelMention(player.textChannelId),
    //       VoiceChannel: channelMention(voiceChannel)
    //     }
    //   );
    //   return false;
    // }

    return true;
  }

  async runSubCommand(
    context: Context,
    SubList: Array<{ prop: string }>,
    options: CommandOptions
  ) {
    const args = await context.getInteractionArgs();
    for (const Command of SubList) {
      if (args.getSubcommand() === Command.prop) {
        const _SubCommand: BaseCommand =
          this.client.Collections.SubCommands.get(
            `${Command.prop}${options.category}`
          );

        if (_SubCommand) {
          const Checker = await this.runCheck(context.interaction, _SubCommand);
          if (Checker) {
            const newContext = new Context(
              context.interaction,
              args.data[0].options,
              true
            );
            _SubCommand
              .run(this.client, newContext)
              .catch(async (error: Error) => {
                this.client.logger.error(error.stack);
                return;
              });
          }
        }
      }
    }
  }
}
