/* eslint-disable no-empty-function */
import NDBClient from "@/Core/NDBClient";
import { BaseCommand } from "@/Utils/Structures";
import { EmbedBuilder, Message, PartialMessage } from "discord.js";

export default class CheckerEmbeds {
  public constructor(
    private client: NDBClient,
    private _Command: BaseCommand,
    private mode: "Guild" | "DM",
    private prefix?: string
  ) {}

  public async minArgs(
    message: Message | PartialMessage,
    _Command: BaseCommand = this._Command as BaseCommand
  ): Promise<EmbedBuilder> {
    letFunction = async (arg: string, arg2?: Record<string, unknown>) => {
      return await this.client.Translate.Guild(arg, message, arg2);
    };
    if (this.mode === "DM") {
      Function = async (arg, arg2) => {
        return await this.client.Translate.DM(arg, message.author, arg2);
      };
    }
    return new EmbedBuilder()
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL()
      })
      .setTitle(await Function("Tools/Command:Checker:NoMinArgs:Title"))
      .setColor("#c20e00")
      .setDescription(
        await Function("Tools/Command:Checker:NoMinArgs:Description")
      )
      .addFields([
        {
          name: await Function("Tools/Command:Checker:NoMinArgs:Fields:1"),
          value: await Function(
            "Tools/Command:Checker:NoMinArgs:Fields:Content:1",
            { Args: _Command.options.minArgs }
          )
        },
        {
          name: await Function("Tools/Command:Checker:NoMinArgs:Fields:2"),
          value: await Function(
            "Tools/Command:Checker:NoMinArgs:Fields:Content:2",
            {
              Usage: `${this.prefix}${_Command.options.name} ${_Command.options.usage}`
            }
          )
        }
      ])
      .setFooter({
        text: this.client.user.tag,
        iconURL: this.client.user.displayAvatarURL()
      });
  }

  public async maxArgs(
    message: Message | PartialMessage,
    _Command: BaseCommand = this._Command as BaseCommand
  ): Promise<EmbedBuilder> {
    letFunction = async (arg: string, arg2?: Record<string, unknown>) => {
      return await this.client.Translate.Guild(arg, message, arg2);
    };
    if (this.mode === "DM") {
      Function = async (arg, arg2) => {
        return await this.client.Translate.DM(arg, message.author, arg2);
      };
    }
    return new EmbedBuilder()
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL()
      })
      .setTitle(await Function("Tools/Command:Checker:TooManyArgs:Title"))
      .setColor("#c20e00")
      .setDescription(
        await Function("Tools/Command:Checker:TooManyArgs:Description")
      )
      .addFields([
        {
          name: await Function("Tools/Command:Checker:TooManyArgs:Fields:1"),
          value: await Function(
            "Tools/Command:Checker:TooManyArgs:Fields:Content:1",
            { Args: _Command.options.maxArgs }
          )
        },
        {
          name: await Function("Tools/Command:Checker:TooManyArgs:Fields:2"),
          value: await Function(
            "Tools/Command:Checker:TooManyArgs:Fields:Content:2",
            {
              Usage: `${this.prefix}${_Command.options.name} ${_Command.options.usage}`
            }
          )
        }
      ])
      .setFooter({
        text: this.client.user.tag,
        iconURL: this.client.user.displayAvatarURL()
      });
  }
}
