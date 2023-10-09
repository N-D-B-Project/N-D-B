import { INDBClient } from "@/Types";
import { Content } from "@/Types/client";
import {
  CommandInteraction,
  CommandInteractionOption,
  CommandInteractionOptionResolver,
  DMChannel,
  EmojiResolvable,
  Guild,
  GuildTextBasedChannel,
  Message,
  PartialDMChannel,
  TextChannel,
  User
} from "discord.js";
import { InteractionTools, MessageTools } from "../Tools";

interface SwitchContext {
  isSub?: boolean;
  isDM?: boolean;
}

export default class Context {
  public id: string;
  public isSlash: boolean;
  public message: Message | null;
  public interaction: CommandInteraction | null;
  public author: User;
  public channel:
    | PartialDMChannel
    | GuildTextBasedChannel
    | TextChannel
    | DMChannel;
  public guild: Guild;
  public createdAt: Date;
  public createdTimestamp: number;
  public isPremium: boolean;
  private msg: Message;
  public isSub: boolean;
  public isDM: boolean;

  public constructor(
    public client: INDBClient,
    private context: Message | CommandInteraction,
    public args:
      | Array<string>
      | CommandInteractionOptionResolver
      | Array<CommandInteractionOption>,
    { isSub, isDM }: SwitchContext
  ) {
    this.isSlash = context instanceof CommandInteraction;
    this.configureContext(isSub, isDM);
  }

  private async configureContext(isSub, isDM) {
    this.id = this.context.id;
    this.message = this.isSlash ? null : (this.context as Message);
    this.interaction = this.isSlash
      ? (this.context as CommandInteraction)
      : null;
    this.author =
      this.context instanceof Message ? this.context.author : this.context.user;
    this.channel = this.context.channel;
    this.guild = this.context.guild;
    this.createdAt = this.context.createdAt;
    this.createdTimestamp = this.context.createdTimestamp;
    this.isPremium = (
      await this.client.database.GuildRepo.get(this.guild.id)
    ).Settings.Premium;
    this.isSub = isSub;
    this.isDM = isDM;
  }

  private getGuild() {
    return this.context.client.guilds.fetch(this.guild.id);
  }

  /**
   * @description Use position `-1` to get `Args.join(" ");`
   */
  public getArg(name: string, position: number) {
    return position === -1
      ? (this.args as Array<string>).join(" ")
      : ((this.isSlash
          ? this.isSub
            ? (this.args as Array<CommandInteractionOption>).find(
                arg => arg.name === name
              ).value
            : (this.args as CommandInteractionOptionResolver).get(name)
          : (this.args as Array<string>)[position]) as string);
  }

  public async send(content: Content) {
    if (this.isSlash) {
      return (this.msg = await InteractionTools.reply(
        this.interaction,
        content,
        false
      ));
    }
    return (this.msg = await MessageTools.send(this.channel, content));
  }

  public async reply(content: Content) {
    if (this.isSlash) {
      return (this.msg = await InteractionTools.reply(
        this.interaction,
        content,
        false
      ));
    }
    return (this.msg = await MessageTools.reply(this.message, content));
  }

  public async sendToUserDM(content: Content) {
    return (this.msg = await MessageTools.send(this.author, content));
  }

  public async edit(content: Content) {
    if (this.isSlash) {
      return InteractionTools.editReply(this.interaction, content);
    }
    return MessageTools.edit(this.msg, content);
  }

  public async react(target: Message, emoji: EmojiResolvable) {
    return MessageTools.react(target, emoji);
  }

  public async delete() {
    if (this.context instanceof Message && this.message.deletable) {
      this.message.delete();
    }
  }

  public async getContent() {
    return this.args.toString().toLowerCase();
  }

  public async getInteractionArgs() {
    if (this.isSlash) {
      return this.args as CommandInteractionOptionResolver;
    }
    throw new Error("Don't use this in Message Context");
  }

  public async getChannel(name: string, position: number) {
    const arg = this.getArg(name, position);
    if (this.isSlash) {
      return await (await this.getGuild()).channels.fetch(arg.toString());
    }
    return await (
      await this.getGuild()
    ).channels.fetch(arg.replace("<#", "").replace(">", ""));
  }

  public async getUser(name: string, position: number) {
    const arg = this.getArg(name, position);
    return this.context.client.users.fetch(arg.toString());
  }

  public async getRole(name: string, position: number) {
    const arg = this.getArg(name, position);
    if (this.isSlash) {
      return (await this.getGuild()).roles.fetch(arg);
    }
    return (await this.getGuild()).roles.fetch(
      arg.replace("<@&", "").replace(">", "")
    );
  }

  public async getMember() {
    return await this.guild.members.fetch(this.author.id);
  }
}
