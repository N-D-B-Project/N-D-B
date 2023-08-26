import NDBClient from "@/Core/NDBClient";
import { BaseCommand } from "@/Utils/Structures";
import { ChannelType, Message, TextChannel, User } from "discord.js";
import { MessageTools, Tools } from "../";
import CheckerEmbeds from "./Embeds";

export default class LegacyChecker {
  public constructor(private client: NDBClient) {
    this.client = client;
  }

  public async runCheck(
    message: Message,
    _Command: BaseCommand,
    prefix?: string,
    args?: Array<string>
  ): Promise<boolean> {
    const Options = _Command.options;
    const Channel = message.channel as TextChannel;
    const tools = new Tools(this.client);
    const embeds = new CheckerEmbeds(this.client, _Command, "Guild", prefix);

    if (args.length < _Command.options.minArgs) {
      MessageTools.reply(message, await embeds.minArgs(message));
      return false;
    }

    if (args.length > _Command.options.maxArgs) {
      MessageTools.reply(message, await embeds.maxArgs(message));
      return false;
    }

    if (!message.guild && !Options.DM) {
      MessageTools.reply(
        message,
        await this.client.Translate.Guild("Tools/Command:Checker:DM", message)
      );
      return false;
    }

    if (Options.ownerOnly && !tools.checkOwner(message.author.id)) {
      MessageTools.reply(
        message,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:OwnerOnly",
          message
        )
      );
      return false;
    }

    if (Options.guildOnly && !tools.checkGuild(message.guild.id)) {
      MessageTools.reply(
        message,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:GuildOnly",
          message
        )
      );
      return false;
    }

    if (Options.nsfw && !Channel.nsfw) {
      MessageTools.reply(
        message,
        await this.client.Translate.Guild("Tools/Command:Checker:NSFW", message)
      );
      return false;
    }

    if (Options.disable) {
      MessageTools.reply(
        message,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:Disable",
          message
        )
      );
      return false;
    }
    // if (Options.ndcash && !NDCash) {
    //   MessageTools.reply(
    //     message,
    //     await this.client.Translate.Guild(
    //       "Tools/Command:Checker:NDCash",
    //       message
    //     )
    //   )
    //   return false
    // }
    // if (Options.ndcash && NDCash) {
    //   NDCash -= Options.ndcash
    //   UserProfile.save()
    //   return true
    // }

    if (Options.DM && message.channel.type === ChannelType.DM) {
      await this.client.Translate.Guild(
        "Tools/Command:Checker:OnlyDM",
        message
      );
      return false;
    }

    // const player = await MusicTools.getPlayer(this.client, message.guildId);
    // if (player && Options.category === "🎵 Music") {
    //   if (message.channelId !== player.textChannelId) {
    //     const voiceChannel = await message.guild.channels.fetch(
    //       player.voiceChannelId
    //     );

    //     await this.client.Translate.Guild("Tools/Music:WrongChannel", message, {
    //       TextChannel: player.textChannelId,
    //       VoiceChannel: voiceChannel.name
    //     });
    //     return false;
    //   }
    // }

    return true;
  }

  public async runCheckDM(
    message: Message,
    _Command: BaseCommand,
    prefix?: string,
    args?: Array<string>
  ): Promise<boolean> {
    const Options = _Command.options;
    const Channel = message.channel as TextChannel;
    const tools = new Tools(this.client);
    const embeds = new CheckerEmbeds(this.client, _Command, "DM", prefix);

    if (args.length < _Command.options.minArgs) {
      MessageTools.reply(message, await embeds.minArgs(message));
      return false;
    }

    if (args.length > _Command.options.maxArgs) {
      MessageTools.reply(message, await embeds.maxArgs(message));
      return false;
    }

    if (!message.guild && !Options.DM) {
      MessageTools.reply(
        message,
        await this.client.Translate.DM(
          "Tools/Command:Checker:DM",
          message.member.user as User
        )
      );
      return false;
    }

    if (Options.ownerOnly && !tools.checkOwner(message.author.id)) {
      MessageTools.reply(
        message,
        await this.client.Translate.DM(
          "Tools/Command:Checker:OwnerOnly",
          message.member.user as User
        )
      );
      return false;
    }

    if (Options.guildOnly && !tools.checkGuild(message.guild.id)) {
      MessageTools.reply(
        message,
        await this.client.Translate.DM(
          "Tools/Command:Checker:GuildOnly",
          message.member.user as User
        )
      );
      return false;
    }
    if (Options.nsfw && !Channel.nsfw) {
      MessageTools.reply(
        message,
        await this.client.Translate.DM(
          "Tools/Command:Checker:NSFW",
          message.member.user as User
        )
      );
      return false;
    }
    if (Options.disable) {
      MessageTools.reply(
        message,
        await this.client.Translate.DM(
          "Tools/Command:Checker:Disable",
          message.member.user as User
        )
      );
      return false;
    }

    if (Options.DM && message.channel.type === ChannelType.DM) {
      return true;
    }

    return true;
  }
}
