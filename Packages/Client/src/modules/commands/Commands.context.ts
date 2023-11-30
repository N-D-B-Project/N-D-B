import { Content } from "@/types";
import {
  Client,
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
import { InteractionTools } from "./Interaction";
import { MessageTools } from "./Message";

export type CommandContext = [client: Client, context: Context];

export type IAdditional = "Sub" | "DM" | "Both" | "None";

export class Context {
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
  private msg: Message;
  public isSub: boolean;
  public isDM: boolean;

  public constructor(
    private context: Message | CommandInteraction,
    public args:
      | Array<string>
      | CommandInteractionOptionResolver
      | Array<CommandInteractionOption>,
    public isPremium: boolean,
    Additional: IAdditional,
    public prefix?: string
  ) {
    this.isSlash = context instanceof CommandInteraction;
    this.configureContext(Additional);
  }

  private async configureContext(Additional: IAdditional) {
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
    if (Additional === "Both") {
      this.isSub = true;
      this.isDM = true;
    }
    this.isSub = Additional === "Sub";
    this.isDM = Additional === "DM";
  }

  private getGuild(client: Client) {
    return client.guilds.fetch(this.guild.id);
  }

  /**
   * @description Use position `-1` to get ```TS Args.join(" ");```
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

  public async getChannel(client: Client, name: string, position: number) {
    const arg = this.getArg(name, position);
    if (this.isSlash) {
      return await (await this.getGuild(client)).channels.fetch(arg.toString());
    }
    return await (
      await this.getGuild(client)
    ).channels.fetch(arg.replace("<#", "").replace(">", ""));
  }

  public async getUser(client: Client, name: string, position: number) {
    const arg = this.getArg(name, position);
    return client.users.fetch(arg.toString());
  }

  public async getRole(client: Client, name: string, position: number) {
    const arg = this.getArg(name, position);
    if (this.isSlash) {
      return (await this.getGuild(client)).roles.fetch(arg);
    }
    return (await this.getGuild(client)).roles.fetch(
      arg.replace("<@&", "").replace(">", "")
    );
  }

  public async getMember() {
    return await this.guild.members.fetch(this.author.id);
  }
}
