import { INDBClient } from "@/Types";
import { Content } from "@/Types/client";
import { BaseCommand, Context } from "@/Utils/Structures";
import { ChannelType, TextChannel } from "discord.js";
import { Tools } from ".";
import CheckerEmbeds from "./Embeds";

export default class CommandChecker {
  // eslint-disable-next-line no-empty-function
  public constructor(private client: INDBClient) {}

  public async runCheck(
    context: Context,
    _Command: BaseCommand,
    prefix?: string,
    args?: Array<string>
  ): Promise<boolean> {
    const Options = _Command.options;
    const Channel = context.channel as TextChannel;
    const tools = new Tools(this.client);
    const embeds = new CheckerEmbeds(this.client, context, _Command, prefix);
    if (!context.isSlash) {
      if (args.length < _Command.options.minArgs) {
        this.SendFunction(context, await embeds.minArgs());
        return false;
      }

      if (args.length > _Command.options.maxArgs) {
        this.SendFunction(context, await embeds.maxArgs());
        return false;
      }
    }

    if (!context.guild && !Options.DM) {
      this.SendFunction(
        context,
        await this.client.Translate.TFunction(
          context,
          "Tools/Command:Checker:DM"
        )
      );
      return false;
    }

    if (Options.permissions.ownerOnly && !tools.checkOwner(context.author.id)) {
      this.SendFunction(
        context,
        await this.client.Translate.TFunction(
          context,
          "Tools/Command:Checker:OwnerOnly"
        )
      );
      return false;
    }

    if (
      (Options.permissions.guildOnly || Options.slash.deployMode === "Guild") &&
      !tools.checkGuild(context.guild.id)
    ) {
      this.SendFunction(
        context,
        await this.client.Translate.TFunction(
          context,
          "Tools/Command:Checker:GuildOnly"
        )
      );
      return false;
    }

    if (Options.nsfw && !Channel.nsfw) {
      this.SendFunction(
        context,
        await this.client.Translate.TFunction(
          context,
          "Tools/Command:Checker:NSFW"
        )
      );
      return false;
    }

    if (Options.disable) {
      this.SendFunction(
        context,
        await this.client.Translate.TFunction(
          context,
          "Tools/Command:Checker:Disable"
        )
      );
      return false;
    }
    // if (Options.ndcash && !NDCash) {
    //   this.SendFunction(context,
    //
    //     await this.client.Translate.TFunction(
    //       context, "Tools/Command:Checker:NDCash",
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
      await this.client.Translate.TFunction(
        context,
        "Tools/Command:Checker:OnlyDM"
      );
      return false;
    }

    // const player = await MusicTools.getPlayer(this.client, .guildId);
    // if (player && Options.category === "🎵 Music") {
    //   if (.channelId !== player.textChannelId) {
    //     const voiceChannel = await .guild.channels.fetch(
    //       player.voiceChannelId
    //     );

    //     await this.client.Translate.TFunction(context, "Tools/Music:WrongChannel",  {
    //       TextChannel: channelMention(player.textChannelId),
    //       VoiceChannel: channelMention(voiceChannel)
    //     });
    //     return false;
    //   }
    // }

    return true;
  }

  public async runSubCommand(
    context: Context,
    SubList: Array<{ prop: string }>,
    isDM: boolean
  ) {
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
              { isSub: true, isDM }
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

  private async SendFunction(context: Context, content: Content) {
    if (context.isDM) {
      return context.sendToUserDM(content);
    }
    return context.reply(content);
  }
}
