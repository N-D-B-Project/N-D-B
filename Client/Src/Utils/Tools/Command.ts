import NDBClient from "@Client/NDBClient";
import BaseCommand from "@Structures/BaseCommand";
import { InteractionTools, MessageTools } from "./index";
import {
  CommandInteraction,
  EmbedBuilder,
  Message,
  TextChannel,
} from "discord.js";
import { Document } from "mongoose";

export default class CommandTools {
  public constructor(private client: NDBClient) {
    this.client = client;
  }

  public checkOwner(target: string) {
    return this.client.Config.Owners.includes(target);
  }

  public checkGuild(target: string) {
    return this.client.Config.ServerOnly.ID.includes(target);
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
    msgint: Message | CommandInteraction,
    _Command: BaseCommand,
    type: "message" | "interaction",
    UserProfile: Document,
    prefix?: string,
    args?: Array<string>
  ): Promise<boolean> {
    const Options = _Command.options;
    const Channel = msgint.channel as TextChannel;
    var NDCash = UserProfile.get("NDCash.NDCash");
    var Author: any;
    var Tools: any;

    if (type === "message") {
      msgint = msgint as Message;
      Author = msgint.author;
      Tools = MessageTools;
    } else {
      msgint = msgint as CommandInteraction;
      Author = msgint.member;
      Tools = InteractionTools;
    }

    if (type === "message") {
      if (args.length < _Command.options.minArgs) {
        Tools.reply(
          msgint,
          new EmbedBuilder()
            .setAuthor({
              name: Author.tag,
              iconURL: Author.displayAvatarURL(),
            })
            .setTitle(
              await this.client.translate(
                "Tools/Command:Checker:NoMinArgs:Title",
                msgint
              )
            )
            .setColor("#c20e00")
            .setDescription(
              await this.client.translate(
                "Tools/Command:Checker:NoMinArgs:Description",
                msgint
              )
            )
            .addFields([
              {
                name: await this.client.translate(
                  "Tools/Command:Checker:NoMinArgs:Fields:1",
                  msgint
                ),
                value: await this.client.translate(
                  "Tools/Command:Checker:NoMinArgs:Fields:Content:1",
                  msgint,
                  { Args: _Command.options.minArgs }
                ),
              },
              {
                name: await this.client.translate(
                  "Tools/Command:Checker:NoMinArgs:Fields:2",
                  msgint
                ),
                value: await this.client.translate(
                  "Tools/Command:Checker:NoMinArgs:Fields:Content:2",
                  msgint,
                  {
                    Usage: `${prefix}${_Command.name} ${_Command.options.usage}`,
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
        Tools.reply(
          msgint,
          new EmbedBuilder()
            .setAuthor({
              name: Author.tag,
              iconURL: Author.displayAvatarURL(),
            })
            .setTitle(
              await this.client.translate(
                "Tools/Command:Checker:TooManyArgs:Title",
                msgint
              )
            )
            .setColor("#c20e00")
            .setDescription(
              await this.client.translate(
                "Tools/Command:Checker:TooManyArgs:Description",
                msgint
              )
            )
            .addFields([
              {
                name: await this.client.translate(
                  "Tools/Command:Checker:TooManyArgs:Fields:1",
                  msgint
                ),
                value: await this.client.translate(
                  "Tools/Command:Checker:TooManyArgs:Fields:Content:1",
                  msgint,
                  { Args: _Command.options.maxArgs }
                ),
              },
              {
                name: await this.client.translate(
                  "Tools/Command:Checker:TooManyArgs:Fields:2",
                  msgint
                ),
                value: await this.client.translate(
                  "Tools/Command:Checker:TooManyArgs:Fields:Content:2",
                  msgint,
                  {
                    Usage: `${prefix}${_Command.name} ${_Command.options.usage}`,
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
    }
    if (!msgint.guild && !Options.DM) {
      Tools.reply(
        msgint,
        await this.client.translate("Tools/Command:Checker:DM", msgint)
      );
      return false;
    }

    if (Options.ownerOnly && !this.checkOwner(Author.id)) {
      Tools.reply(
        msgint,
        await this.client.translate("Tools/Command:Checker:OwnerOnly", msgint)
      );
      return false;
    }

    if (Options.guildOnly && !this.checkGuild(msgint.guild.id)) {
      Tools.reply(
        msgint,
        await this.client.translate("Tools/Command:Checker:GuildOnly", msgint)
      );
      return false;
    }
    if (Options.nsfw && !Channel.nsfw) {
      Tools.reply(
        msgint,
        await this.client.translate("Tools/Command:Checker:NSFW", msgint)
      );
      return false;
    }
    if (Options.disable) {
      Tools.reply(
        msgint,
        await this.client.translate("Tools/Command:Checker:Disable", msgint)
      );
      return false;
    }
    if (Options.ndcash && !NDCash) {
      Tools.reply(
        msgint,
        await this.client.translate("Tools/Command:Checker:NDCash", msgint)
      );
      return false;
    }
    if (Options.ndcash && NDCash) {
      NDCash -= Options.ndcash;
      UserProfile.save();
      return true;
    }

    const player = this.client.ErelaManager.players.get(msgint.guild.id);
    // Check Message Channel for Music commands
    if (player && _Command.options.category === "🎵 Music") {
      const TextChannel = msgint.guild.channels.cache.get(
        player.textChannel
      ) as TextChannel;
      if (msgint.channel.id != player.textChannel)
        Tools.reply(
          msgint,
          await this.client.translate("Tools/ErelaTools:WrongChannel", msgint, {
            CHANNEL: TextChannel.id,
          })
        );
    }

    return true;
  }
}
