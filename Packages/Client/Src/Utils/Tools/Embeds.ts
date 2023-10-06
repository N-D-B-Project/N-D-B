/* eslint-disable no-empty-function */
import { INDBClient } from "@/Types";
import { BaseCommand, Context } from "@/Utils/Structures";
import { EmbedBuilder } from "discord.js";

export default class CheckerEmbeds {
  public constructor(
    private client: INDBClient,
    private context: Context,
    private _Command: BaseCommand,
    private mode: "Guild" | "DM",
    private prefix?: string
  ) {}

  private async TFunction(key: string, args?: Record<string, unknown>) {
    if (this.mode === "DM") {
      return await this.client.Translate.DM(key, this.context.author, args);
    }
    if (this.context.isSlash) {
      return await this.client.Translate.Guild(
        key,
        this.context.interaction,
        args
      );
    }
    return await this.client.Translate.Guild(key, this.context.message, args);
  }

  public async minArgs(): Promise<EmbedBuilder> {
    return new EmbedBuilder()
      .setAuthor({
        name: this.context.author.tag,
        iconURL: this.context.author.displayAvatarURL()
      })
      .setTitle(await this.TFunction("Tools/Command:Checker:NoMinArgs:Title"))
      .setColor("#c20e00")
      .setDescription(
        await this.TFunction("Tools/Command:Checker:NoMinArgs:Description")
      )
      .addFields([
        {
          name: await this.TFunction(
            "Tools/Command:Checker:NoMinArgs:Fields:1"
          ),
          value: await this.TFunction(
            "Tools/Command:Checker:NoMinArgs:Fields:Content:1",
            { Args: this._Command.options.minArgs }
          )
        },
        {
          name: await this.TFunction(
            "Tools/Command:Checker:NoMinArgs:Fields:2"
          ),
          value: await this.TFunction(
            "Tools/Command:Checker:NoMinArgs:Fields:Content:2",
            {
              Usage: `${this.prefix}${this._Command.options.name} ${this._Command.options.usage}`
            }
          )
        }
      ])
      .setFooter({
        text: this.client.user.tag,
        iconURL: this.client.user.displayAvatarURL()
      });
  }

  public async maxArgs(): Promise<EmbedBuilder> {
    return new EmbedBuilder()
      .setAuthor({
        name: this.context.author.tag,
        iconURL: this.context.author.displayAvatarURL()
      })
      .setTitle(await this.TFunction("Tools/Command:Checker:TooManyArgs:Title"))
      .setColor("#c20e00")
      .setDescription(
        await this.TFunction("Tools/Command:Checker:TooManyArgs:Description")
      )
      .addFields([
        {
          name: await this.TFunction(
            "Tools/Command:Checker:TooManyArgs:Fields:1"
          ),
          value: await this.TFunction(
            "Tools/Command:Checker:TooManyArgs:Fields:Content:1",
            { Args: this._Command.options.maxArgs }
          )
        },
        {
          name: await this.TFunction(
            "Tools/Command:Checker:TooManyArgs:Fields:2"
          ),
          value: await this.TFunction(
            "Tools/Command:Checker:TooManyArgs:Fields:Content:2",
            {
              Usage: `${this.prefix}${this._Command.options.name} ${this._Command.options.usage}`
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
