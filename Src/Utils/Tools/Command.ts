import NDBClient from "@Client/NDBClient";
import BaseCommand from "@Structures/BaseCommand";
import { InteractionTools, MessageTools } from ".";
import * as Discord from "discord.js";
import * as Mongoose from "mongoose";
import { APIInteractionGuildMember } from "discord-api-types";

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
    msgint: Discord.Message | Discord.CommandInteraction,
    _Command: BaseCommand,
    type: "message" | "interaction",
    UserProfile: Mongoose.Document
  ): Promise<boolean> {
    const Options = _Command.options;
    const Channel = msgint.channel as Discord.TextChannel;
    var NDCash = UserProfile.get("NDCash.NDCash");
    var Author: any;
    var Tools: any;

    if (type === "message") {
      msgint = msgint as Discord.Message;
      Author = msgint.author;
      Tools = MessageTools;
    } else {
      msgint = msgint as Discord.CommandInteraction;
      Author = msgint.member;
      Tools = InteractionTools;
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

    return true;
  }
}
