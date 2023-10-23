import MusicTools from "@/Modules/Music/Utils/Tools";
import { Content } from "@/Types/client";
import { BaseCommand, Context } from "@/Utils/Structures";
import {
  ChannelType,
  TextChannel,
  VoiceChannel,
  channelMention
} from "discord.js";
import { Tools } from ".";
import CheckerEmbeds from "./Embeds";

export default class CommandChecker {
  public async runCheck(
    context: Context,
    _Command: BaseCommand,
    prefix?: string,
    args?: Array<string>
  ): Promise<boolean> {
    const Options = _Command.options;
    const Channel = context.channel as TextChannel;
    const tools = new Tools(context.client);
    const embeds = new CheckerEmbeds(context, _Command, prefix);
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
        await context.client.Translate.TFunction(
          context,
          "Tools/Command:Checker:DM"
        )
      );
      return false;
    }

    if (Options.permissions.bot) {
      if (!context.guild.members.me.permissions.has(Options.permissions.bot)) {
        this.SendFunction(
          context,
          await context.client.Translate.TFunction(
            context,
            "Tools/Commands:Permission:Bot",
            {
              PERMS: context.client.Tools.formatArray(
                Options.permissions.bot as Array<string>
              )
            }
          )
        );
      }
    }

    if (Options.permissions.user) {
      if (
        !(await context.guild.members.fetch(context.author.id)).permissions.has(
          Options.permissions.user
        )
      ) {
        this.SendFunction(
          context,
          await context.client.Translate.TFunction(
            context,
            "Tools/Commands:Permission:User",
            {
              PERMS: context.client.Tools.formatArray(
                Options.permissions.user as Array<string>
              )
            }
          )
        );
      }
    }

    if (Options.permissions.ownerOnly && !tools.checkOwner(context.author.id)) {
      this.SendFunction(
        context,
        await context.client.Translate.TFunction(
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
        await context.client.Translate.TFunction(
          context,
          "Tools/Command:Checker:GuildOnly"
        )
      );
      return false;
    }

    if (Options.nsfw && !Channel.nsfw) {
      this.SendFunction(
        context,
        await context.client.Translate.TFunction(
          context,
          "Tools/Command:Checker:NSFW"
        )
      );
      return false;
    }

    if (Options.disable) {
      this.SendFunction(
        context,
        await context.client.Translate.TFunction(
          context,
          "Tools/Command:Checker:Disable"
        )
      );
      return false;
    }
    // if (Options.ndcash && !NDCash) {
    //   this.SendFunction(context,
    //
    //     await context.client.Translate.TFunction(
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
      await context.client.Translate.TFunction(
        context,
        "Tools/Command:Checker:OnlyDM"
      );
      return false;
    }

    if (!Options.DM) {
      const player = await MusicTools.getPlayer(context);
      if (player && Options.category === "🎵 Music") {
        if (context.channel.id !== player.textChannelId) {
          const voiceChannel = (await context.client.channels.fetch(
            player.voiceChannelId
          )) as VoiceChannel;

          await context.client.Translate.TFunction(
            context,
            "Tools/Music:WrongChannel",
            {
              TextChannel: channelMention(player.textChannelId),
              VoiceChannel: channelMention(voiceChannel.id)
            }
          );
          return false;
        }
      }
    }

    return true;
  }

  public async runSubCommand(
    context: Context,
    SubList: Array<{ prop: string }>,
    isDM: boolean
  ) {
    const Additional = isDM ? "Both" : "Sub";
    const args = await context.getInteractionArgs();
    for (const Command of SubList) {
      if (args.getSubcommand() === Command.prop) {
        console.log(context.client.Collections.SubCommands.keys());
        const _SubCommand: BaseCommand =
          context.client.Collections.SubCommands.get(args.getSubcommand());
        console.log(_SubCommand);
        if (_SubCommand) {
          const Checker = await this.runCheck(context, _SubCommand);
          if (Checker) {
            const newContext = new Context(
              context.client,
              context.interaction,
              args.data[0].options,
              context.isPremium,
              Additional
            );
            _SubCommand.run(newContext).catch(async (error: Error) => {
              context.client.logger.error(error.stack);
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
