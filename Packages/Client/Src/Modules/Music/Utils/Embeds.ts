import NDBClient from "@/Core/NDBClient";
import {
  ColorResolvable,
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  Message,
  User
} from "discord.js";
import { Track } from "erela.js";
import MusicTools from "./Tools";

export default class MusicEmbeds {
  public constructor(private readonly client: NDBClient) {}

  private async createBaseEmbed(
    msgint: Message | CommandInteraction,
    color: "Error" | "Success"
  ): Promise<EmbedBuilder> {
    const user = msgint.member.user as User;
    if (color === "Error") var hex = "#c20e00";
    else hex = "#00c26f";
    return new EmbedBuilder()
      .setAuthor({
        name: user.username,
        iconURL: user.displayAvatarURL()
      })
      .setTimestamp()
      .setColor(hex as ColorResolvable);
  }

  public async NoChannelEmbed(
    msgint: Message | CommandInteraction
  ): Promise<EmbedBuilder> {
    const baseEmbed = await this.createBaseEmbed(msgint, "Error");
    return baseEmbed
      .setTitle(
        await this.client.Translate.Guild(
          "Tools/Music:NoChannelEmbed:Title",
          msgint
        )
      )
      .setDescription(
        await this.client.Translate.Guild(
          "Tools/Music:NoChannelEmbed:Description",
          msgint
        )
      )
      .setFooter({
        text: await this.client.Translate.Guild(
          "Tools/Music:NoChannelEmbed:Footer",
          msgint
        ),
        iconURL: this.client.user.displayAvatarURL()
      });
  }

  public async NoArgsEmbed(
    msgint: Message | CommandInteraction
  ): Promise<EmbedBuilder> {
    const baseEmbed = await this.createBaseEmbed(msgint, "Error");
    return baseEmbed
      .setTitle(
        await this.client.Translate.Guild(
          "Tools/Music:NoArgsEmbed:Title",
          msgint
        )
      )
      .setDescription(
        await this.client.Translate.Guild(
          "Tools/Music:NoArgsEmbed:Description",
          msgint
        )
      )
      .setFooter({
        text: await this.client.Translate.Guild(
          "Tools/Music:NoArgsEmbed:Footer",
          msgint
        ),
        iconURL: this.client.user.displayAvatarURL()
      });
  }

  public async LoadTypeEmbeds(
    msgint: Message | CommandInteraction,
    loadType: string,
    args?: Array<string> | CommandInteractionOptionResolver,
    isSlash?: boolean,
    track?: Track
  ): Promise<EmbedBuilder> {
    const Checker = await MusicTools.Checker(args, isSlash);
    const baseEmbed = await this.createBaseEmbed(msgint, "Error");
    switch (loadType) {
      case "Fail":
        baseEmbed
          .setTitle(
            await this.client.Translate.Guild(
              "Tools/Music:loadType:LOAD_FAILED:Embed:Title",
              msgint
            )
          )
          .setDescription(
            await this.client.Translate.Guild(
              "Tools/Music:loadType:LOAD_FAILED:Embed:Description",
              msgint
            )
          )
          .setFooter({
            text: await this.client.Translate.Guild(
              "Tools/Music:loadType:LOAD_FAILED:Embed:Footer",
              msgint
            ),
            iconURL: this.client.user.displayAvatarURL()
          });

        break;
      case "NoMatches":
        baseEmbed
          .setTitle(
            await this.client.Translate.Guild(
              "Tools/Music:loadType:NO_MATCHES:Embed:Title",
              msgint
            )
          )
          .setDescription(
            await this.client.Translate.Guild(
              "Tools/Music:loadType:NO_MATCHES:Embed:Description",
              msgint
            )
          )
          .setFooter({
            text: await this.client.Translate.Guild(
              "Tools/Music:loadType:NO_MATCHES:Embed:Footer",
              msgint
            ),
            iconURL: this.client.user.displayAvatarURL()
          });

        break;
      case "Success":
        const Timer = await this.client.Tools.Timer(
          "normal",
          track.duration,
          msgint
        );
        baseEmbed
          .setColor("#00c26f")
          .setTitle(
            await this.client.Translate.Guild(
              "Tools/Music:loadType:SUCCESS:Embed:Title",
              msgint
            )
          )
          .addFields([
            {
              name: await this.client.Translate.Guild(
                "Tools/Music:loadType:SUCCESS:Embed:Fields:1",
                msgint,
                { EMOJI: Checker.Emoji, NAME: Checker.Name }
              ),
              value: await this.client.Translate.Guild(
                "Tools/Music:loadType:SUCCESS:Embed:Fields:Content:1",
                msgint,
                { TITLE: track.title, URI: track.uri }
              ),
              inline: true
            },
            {
              name: await this.client.Translate.Guild(
                "Tools/Music:loadType:SUCCESS:Embed:Fields:2",
                msgint
              ),
              value: await this.client.Translate.Guild(
                "Tools/Music:loadType:SUCCESS:Embed:Fields:Content:2",
                msgint,
                { AUTHOR: track.author }
              ),
              inline: true
            },
            {
              name: await this.client.Translate.Guild(
                "Tools/Music:loadType:SUCCESS:Embed:Fields:3",
                msgint
              ),
              value: await this.client.Translate.Guild(
                "Tools/Music:loadType:SUCCESS:Embed:Fields:Content:3",
                msgint,
                { TIMER: Timer }
              ),
              inline: true
            }
          ])
          .setThumbnail(track.artworkUrl)
          .setFooter({
            text: await this.client.Translate.Guild(
              "Tools/Music:loadType:SUCCESS:Embed:Footer",
              msgint
            ),
            iconURL: this.client.user.displayAvatarURL()
          });

        break;
    }

    return baseEmbed;
  }

  public async PlaylistEmbed(
    msgint: Message | CommandInteraction,
    loadType: string,
    args?: Array<string> | CommandInteractionOptionResolver,
    isSlash?: boolean,
    track?: Track
  ): Promise<EmbedBuilder> {
    return;
  }
}
