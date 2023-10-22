/* eslint-disable no-empty-function */
import { BaseCommand, Context } from "@/Utils/Structures";
import { EmbedBuilder } from "discord.js";

export default class CheckerEmbeds {
  public constructor(
    private context: Context,
    private _Command: BaseCommand,
    private prefix?: string
  ) {}

  public async minArgs(): Promise<EmbedBuilder> {
    return new EmbedBuilder()
      .setAuthor({
        name: this.context.author.tag,
        iconURL: this.context.author.displayAvatarURL()
      })
      .setTitle(
        await this.context.client.Translate.TFunction(
          this.context,
          "Tools/Command:Checker:NoMinArgs:Title"
        )
      )
      .setColor("#c20e00")
      .setDescription(
        await this.context.client.Translate.TFunction(
          this.context,
          "Tools/Command:Checker:NoMinArgs:Description"
        )
      )
      .addFields([
        {
          name: await this.context.client.Translate.TFunction(
            this.context,
            "Tools/Command:Checker:NoMinArgs:Fields:1"
          ),
          value: await this.context.client.Translate.TFunction(
            this.context,
            "Tools/Command:Checker:NoMinArgs:Fields:Content:1",
            { Args: this._Command.options.minArgs }
          )
        },
        {
          name: await this.context.client.Translate.TFunction(
            this.context,
            "Tools/Command:Checker:NoMinArgs:Fields:2"
          ),
          value: await this.context.client.Translate.TFunction(
            this.context,
            "Tools/Command:Checker:NoMinArgs:Fields:Content:2",
            {
              Usage: `${this.prefix}${this._Command.options.name} ${this._Command.options.usage}`
            }
          )
        }
      ])
      .setFooter({
        text: this.context.client.user.tag,
        iconURL: this.context.client.user.displayAvatarURL()
      });
  }

  public async maxArgs(): Promise<EmbedBuilder> {
    return new EmbedBuilder()
      .setAuthor({
        name: this.context.author.tag,
        iconURL: this.context.author.displayAvatarURL()
      })
      .setTitle(
        await this.context.client.Translate.TFunction(
          this.context,
          "Tools/Command:Checker:TooManyArgs:Title"
        )
      )
      .setColor("#c20e00")
      .setDescription(
        await this.context.client.Translate.TFunction(
          this.context,
          "Tools/Command:Checker:TooManyArgs:Description"
        )
      )
      .addFields([
        {
          name: await this.context.client.Translate.TFunction(
            this.context,
            "Tools/Command:Checker:TooManyArgs:Fields:1"
          ),
          value: await this.context.client.Translate.TFunction(
            this.context,
            "Tools/Command:Checker:TooManyArgs:Fields:Content:1",
            { Args: this._Command.options.maxArgs }
          )
        },
        {
          name: await this.context.client.Translate.TFunction(
            this.context,
            "Tools/Command:Checker:TooManyArgs:Fields:2"
          ),
          value: await this.context.client.Translate.TFunction(
            this.context,
            "Tools/Command:Checker:TooManyArgs:Fields:Content:2",
            {
              Usage: `${this.prefix}${this._Command.options.name} ${this._Command.options.usage}`
            }
          )
        }
      ])
      .setFooter({
        text: this.context.client.user.tag,
        iconURL: this.context.client.user.displayAvatarURL()
      });
  }
}
