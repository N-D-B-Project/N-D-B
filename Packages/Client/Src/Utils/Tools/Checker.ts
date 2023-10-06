import { INDBClient } from "@/Types";
import { BaseCommand, Context } from "@/Utils/Structures";
import { ChannelType, TextChannel } from "discord.js";
import { Tools } from ".";
import CheckerEmbeds from "./Embeds";

export default class CommandChecker {
  // eslint-disable-next-line no-empty-function
  public constructor(private client: INDBClient) {}
  public test() {
    return "Works";
  }
  public async runCheck(
    context: Context,
    _Command: BaseCommand,
    prefix?: string,
    args?: Array<string>
  ): Promise<boolean> {
    const Options = _Command.options;
    const Channel = context.channel as TextChannel;
    const tools = new Tools(this.client);
    const embeds = new CheckerEmbeds(
      this.client,
      context,
      _Command,
      "Guild",
      prefix
    );

    if (!context.isSlash) {
      if (args.length < _Command.options.minArgs) {
        context.reply(await embeds.minArgs());
        return false;
      }

      if (args.length > _Command.options.maxArgs) {
        context.reply(await embeds.maxArgs());
        return false;
      }
    }

    if (!context.guild && !Options.DM) {
      context.reply(
        await this.client.Translate.Guild("Tools/Command:Checker:DM", context)
      );
      return false;
    }

    if (Options.permissions.ownerOnly && !tools.checkOwner(context.author.id)) {
      context.reply(
        await this.client.Translate.Guild(
          "Tools/Command:Checker:OwnerOnly",
          context
        )
      );
      return false;
    }

    if (
      (Options.permissions.guildOnly || Options.slash.deployMode === "Guild") &&
      !tools.checkGuild(context.guild.id)
    ) {
      context.reply(
        await this.client.Translate.Guild(
          "Tools/Command:Checker:GuildOnly",
          context
        )
      );
      return false;
    }

    if (Options.nsfw && !Channel.nsfw) {
      context.reply(
        await this.client.Translate.Guild("Tools/Command:Checker:NSFW", context)
      );
      return false;
    }

    if (Options.disable) {
      context.reply(
        await this.client.Translate.Guild(
          "Tools/Command:Checker:Disable",
          context
        )
      );
      return false;
    }
    // if (Options.ndcash && !NDCash) {
    //   context.reply(
    //
    //     await this.client.Translate.Guild(
    //       "Tools/Command:Checker:NDCash",
    //
    //     )
    //   )
    //   return false
    // }
    // if (Options.ndcash && NDCash) {
    //   NDCash -= Options.ndcash
    //   UserProfile.save()
    //   return true
    // }

    if (Options.DM && context.channel.type === ChannelType.DM) {
      await this.client.Translate.Guild(
        "Tools/Command:Checker:OnlyDM",
        context
      );
      return false;
    }

    // const player = await MusicTools.getPlayer(this.client, .guildId);
    // if (player && Options.category === "🎵 Music") {
    //   if (.channelId !== player.textChannelId) {
    //     const voiceChannel = await .guild.channels.fetch(
    //       player.voiceChannelId
    //     );

    //     await this.client.Translate.Guild("Tools/Music:WrongChannel",  {
    //       TextChannel: channelMention(player.textChannelId),
    //       VoiceChannel: channelMention(voiceChannel)
    //     });
    //     return false;
    //   }
    // }

    return true;
  }

  public async runCheckDM(
    context: Context,
    _Command: BaseCommand,
    prefix?: string,
    args?: Array<string>
  ): Promise<boolean> {
    const Options = _Command.options;
    const Channel = context.channel as TextChannel;
    const tools = new Tools(this.client);
    const embeds = new CheckerEmbeds(
      this.client,
      context,
      _Command,
      "DM",
      prefix
    );

    if (args.length < _Command.options.minArgs) {
      context.sendToUserDM(await embeds.minArgs());
      return false;
    }

    if (args.length > _Command.options.maxArgs) {
      context.reply(await embeds.maxArgs());
      return false;
    }

    if (!context.guild && !Options.DM) {
      context.sendToUserDM(
        await this.client.Translate.DM(
          "Tools/Command:Checker:DM",
          context.author
        )
      );
      return false;
    }

    if (Options.permissions.ownerOnly && !tools.checkOwner(context.author.id)) {
      context.reply(
        await this.client.Translate.DM(
          "Tools/Command:Checker:OwnerOnly",
          context.author
        )
      );
      return false;
    }

    if (Options.permissions.guildOnly && !tools.checkGuild(context.guild.id)) {
      context.reply(
        await this.client.Translate.DM(
          "Tools/Command:Checker:GuildOnly",
          context.author
        )
      );
      return false;
    }
    if (Options.nsfw && !Channel.nsfw) {
      context.reply(
        await this.client.Translate.DM(
          "Tools/Command:Checker:NSFW",
          context.author
        )
      );
      return false;
    }
    if (Options.disable) {
      context.reply(
        await this.client.Translate.DM(
          "Tools/Command:Checker:Disable",
          context.author
        )
      );
      return false;
    }

    if (Options.DM && context.channel.type === ChannelType.DM) {
      return true;
    }

    return true;
  }

  async runSubCommand(context: Context, SubList: Array<{ prop: string }>) {
    const args = await context.getInteractionArgs();
    for (const Command of SubList) {
      if (args.getSubcommand() === Command.prop) {
        const _SubCommand: BaseCommand =
          this.client.Collections.SubCommands.get(Command.prop);
        if (_SubCommand) {
          const Checker = await this.runCheck(context, _SubCommand);
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
