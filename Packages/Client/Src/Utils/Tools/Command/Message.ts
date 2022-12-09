import NDBClient from "@Client/NDBClient";
import { BaseCommand } from "@Utils/Structures";
import { MessageTools } from "../index";
import {
  ChannelType,
  EmbedBuilder,
  Message,
  TextChannel,
  User,
} from "discord.js";
import { Document } from "mongoose";
import { Config } from "~/Config/Config";

export default class CommandTools {
  public constructor(private client: NDBClient) {
    this.client = client;
  }

  public checkOwner(target: string) {
    return Config.Owners.includes(target);
  }

  public checkGuild(target: string) {
    return Config.ServerOnly.ID.includes(target);
  }

  public capitalize(string: string) {
    return string
      .split(" ")
      .map((str) => str.slice(0, 1).toUpperCase() + str.slice(1))
      .join(" ");
  }

  public removeDuplicates(arr) {
    return [...new Set(arr)];
  }

  public resolveCommand(nameOrAlias: string) {
    return (
      this.client.Collections.commands.get(nameOrAlias) ??
      this.client.Collections.commands.get(
        this.client.Collections.aliases.get(nameOrAlias)!
      )
    );
  }

  public async runCheck(
    message: Message,
    _Command: BaseCommand,
    UserProfile: Document,
    prefix?: string,
    args?: Array<string>
  ): Promise<boolean> {
    const Options = _Command.options;
    const Channel = message.channel as TextChannel;
    var NDCash = UserProfile.get("NDCash.NDCash");

    if (args.length < _Command.options.minArgs) {
      MessageTools.reply(
        message,
        new EmbedBuilder()
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL(),
          })
          .setTitle(
            await this.client.Translate.Guild(
              "Tools/Command:Checker:NoMinArgs:Title",
              message
            )
          )
          .setColor("#c20e00")
          .setDescription(
            await this.client.Translate.Guild(
              "Tools/Command:Checker:NoMinArgs:Description",
              message
            )
          )
          .addFields([
            {
              name: await this.client.Translate.Guild(
                "Tools/Command:Checker:NoMinArgs:Fields:1",
                message
              ),
              value: await this.client.Translate.Guild(
                "Tools/Command:Checker:NoMinArgs:Fields:Content:1",
                message,
                { Args: _Command.options.minArgs }
              ),
            },
            {
              name: await this.client.Translate.Guild(
                "Tools/Command:Checker:NoMinArgs:Fields:2",
                message
              ),
              value: await this.client.Translate.Guild(
                "Tools/Command:Checker:NoMinArgs:Fields:Content:2",
                message,
                {
                  Usage: `${prefix}${_Command.options.name} ${_Command.options.usage}`,
                }
              ),
            },
          ])
          .setFooter({
            text: this.client.user.tag,
            iconURL: this.client.user.displayAvatarURL(),
          })
      );
      return false;
    }

    if (args.length > _Command.options.maxArgs) {
      MessageTools.reply(
        message,
        new EmbedBuilder()
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL(),
          })
          .setTitle(
            await this.client.Translate.Guild(
              "Tools/Command:Checker:TooManyArgs:Title",
              message
            )
          )
          .setColor("#c20e00")
          .setDescription(
            await this.client.Translate.Guild(
              "Tools/Command:Checker:TooManyArgs:Description",
              message
            )
          )
          .addFields([
            {
              name: await this.client.Translate.Guild(
                "Tools/Command:Checker:TooManyArgs:Fields:1",
                message
              ),
              value: await this.client.Translate.Guild(
                "Tools/Command:Checker:TooManyArgs:Fields:Content:1",
                message,
                { Args: _Command.options.maxArgs }
              ),
            },
            {
              name: await this.client.Translate.Guild(
                "Tools/Command:Checker:TooManyArgs:Fields:2",
                message
              ),
              value: await this.client.Translate.Guild(
                "Tools/Command:Checker:TooManyArgs:Fields:Content:2",
                message,
                {
                  Usage: `${prefix}${_Command.options.name} ${_Command.options.usage}`,
                }
              ),
            },
          ])
          .setFooter({
            text: this.client.user.tag,
            iconURL: this.client.user.displayAvatarURL(),
          })
      );
      return false;
    }
    if (!message.guild && !Options.DM) {
      MessageTools.reply(
        message,
        await this.client.Translate.Guild("Tools/Command:Checker:DM", message)
      );
      return false;
    }

    if (Options.ownerOnly && !this.checkOwner(message.author.id)) {
      MessageTools.reply(
        message,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:OwnerOnly",
          message
        )
      );
      return false;
    }

    if (Options.guildOnly && !this.checkGuild(message.guild.id)) {
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
    if (Options.ndcash && !NDCash) {
      MessageTools.reply(
        message,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:NDCash",
          message
        )
      );
      return false;
    }
    if (Options.ndcash && NDCash) {
      NDCash -= Options.ndcash;
      UserProfile.save();
      return true;
    }

    if (Options.DM && message.channel.type === ChannelType.DM) {
      await this.client.Translate.Guild(
        "Tools/Command:Checker:OnlyDM",
        message
      );
      return false;
    }
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

    if (args.length < _Command.options.minArgs) {
      MessageTools.reply(
        message,
        new EmbedBuilder()
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL(),
          })
          .setTitle(
            await this.client.Translate.DM(
              "Tools/Command:Checker:NoMinArgs:Title",
              message.member.user as User
            )
          )
          .setColor("#c20e00")
          .setDescription(
            await this.client.Translate.DM(
              "Tools/Command:Checker:NoMinArgs:Description",
              message.member.user as User
            )
          )
          .addFields([
            {
              name: await this.client.Translate.DM(
                "Tools/Command:Checker:NoMinArgs:Fields:1",
                message.member.user as User
              ),
              value: await this.client.Translate.DM(
                "Tools/Command:Checker:NoMinArgs:Fields:Content:1",
                message.member.user as User,
                { Args: _Command.options.minArgs }
              ),
            },
            {
              name: await this.client.Translate.DM(
                "Tools/Command:Checker:NoMinArgs:Fields:2",
                message.member.user as User
              ),
              value: await this.client.Translate.DM(
                "Tools/Command:Checker:NoMinArgs:Fields:Content:2",
                message.member.user as User,
                {
                  Usage: `${prefix}${_Command.options.name} ${_Command.options.usage}`,
                }
              ),
            },
          ])
          .setFooter({
            text: this.client.user.tag,
            iconURL: this.client.user.displayAvatarURL(),
          })
      );
      return false;
    }

    if (args.length > _Command.options.maxArgs) {
      MessageTools.reply(
        message,
        new EmbedBuilder()
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL(),
          })
          .setTitle(
            await this.client.Translate.DM(
              "Tools/Command:Checker:TooManyArgs:Title",
              message.member.user as User
            )
          )
          .setColor("#c20e00")
          .setDescription(
            await this.client.Translate.DM(
              "Tools/Command:Checker:TooManyArgs:Description",
              message.member.user as User
            )
          )
          .addFields([
            {
              name: await this.client.Translate.DM(
                "Tools/Command:Checker:TooManyArgs:Fields:1",
                message.member.user as User
              ),
              value: await this.client.Translate.DM(
                "Tools/Command:Checker:TooManyArgs:Fields:Content:1",
                message.member.user as User,
                { Args: _Command.options.maxArgs }
              ),
            },
            {
              name: await this.client.Translate.DM(
                "Tools/Command:Checker:TooManyArgs:Fields:2",
                message.member.user as User
              ),
              value: await this.client.Translate.DM(
                "Tools/Command:Checker:TooManyArgs:Fields:Content:2",
                message.member.user as User,
                {
                  Usage: `${prefix}${_Command.options.name} ${_Command.options.usage}`,
                }
              ),
            },
          ])
          .setFooter({
            text: this.client.user.tag,
            iconURL: this.client.user.displayAvatarURL(),
          })
      );
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

    if (Options.ownerOnly && !this.checkOwner(message.author.id)) {
      MessageTools.reply(
        message,
        await this.client.Translate.DM(
          "Tools/Command:Checker:OwnerOnly",
          message.member.user as User
        )
      );
      return false;
    }

    if (Options.guildOnly && !this.checkGuild(message.guild.id)) {
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
