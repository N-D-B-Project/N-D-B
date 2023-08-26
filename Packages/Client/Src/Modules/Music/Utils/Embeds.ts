/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-function */

import { Emojis } from "@/Config/Config";
import NDBClient from "@/Core/NDBClient";
import {
  ColorResolvable,
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  Message,
  User
} from "discord.js";
import { SearchResult, Track } from "lavalink-client";
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

  public async NoPlayer(msgint: Message | CommandInteraction) {
    const baseEmbed = await this.createBaseEmbed(msgint, "Error");
    return baseEmbed
      .setTitle(
        await this.client.Translate.Guild(
          "Tools/Music:NoPlayerEmbed:Title",
          msgint
        )
      )
      .addFields([
        {
          name: await this.client.Translate.Guild(
            "Tools/Music:NoPlayerEmbed:Fields:1",
            msgint
          ),
          value: await this.client.Translate.Guild(
            "Tools/Music:NoPlayerEmbed:Fields:Content:1",
            msgint,
            { GuildName: msgint.guild.name }
          )
        }
      ]);
  }

  public async NoChannel(
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

  public async NoArgs(
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

  public async LoadType(
    msgint: Message | CommandInteraction,
    loadType: string,
    args?: Array<string> | CommandInteractionOptionResolver,
    isSlash?: boolean,
    track?: Track
  ): Promise<EmbedBuilder> {
    const Checker = await MusicTools.URLChecker(args, isSlash);
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
          track.info.duration,
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
                { TITLE: track.info.title, URI: track.info.uri }
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
                { AUTHOR: track.info.author }
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
          .setThumbnail(track.info.artworkUrl)
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

  public async Playlist(
    msgint: Message | CommandInteraction,
    args: Array<string> | CommandInteractionOptionResolver,
    isSlash: boolean,
    res: SearchResult,
    url: string
  ): Promise<EmbedBuilder> {
    const Checker = await MusicTools.URLChecker(args, isSlash);
    const Timer = await this.client.Tools.Timer(
      "normal",
      res.playlist.duration,
      msgint
    );
    const baseEmbed = await this.createBaseEmbed(msgint, "Success");
    return baseEmbed
      .setTitle(
        await this.client.Translate.Guild(
          "Tools/Music:loadType:SUCCESS:Embed:PlaylistTitle",
          msgint
        )
      )
      .setThumbnail(res.playlist.thumbnail)
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
            // eslint-disable-next-line no-inline-comments
            { TITLE: res.playlist.name, URI: url /* res.playlist.uri */ }
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
            // eslint-disable-next-line no-inline-comments
            { AUTHOR: res.tracks[0].info.author /* res.playlist.author */ }
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
      .setFooter({
        text: await this.client.Translate.Guild(
          "Tools/Music:loadType:SUCCESS:Embed:Footer",
          msgint
        ),
        iconURL: this.client.user.displayAvatarURL()
      });
  }

  public async NowPlaying(
    msgint: Message | CommandInteraction,
    isPremium: boolean
  ): Promise<EmbedBuilder> {
    const baseEmbed = await this.createBaseEmbed(msgint, "Success");
    const player = await MusicTools.getPlayer(
      msgint.client as NDBClient,
      msgint.guildId,
      isPremium
    );
    const music = player.queue.current;
    let IsLoop: string;
    switch (player.repeatMode) {
      case "off":
        IsLoop = await this.client.Translate.Guild(
          "Tools/Music:NowPlayingEmbed:NoLoop",
          msgint,
          { Emoji: Emojis.fail }
        );
        break;
      case "queue":
        IsLoop = await this.client.Translate.Guild(
          "Tools/Music:NowPlayingEmbed:QueueLoop",
          msgint,
          { Emoji: Emojis.success }
        );
      case "track":
        IsLoop = await this.client.Translate.Guild(
          "Tools/Music:NowPlayingEmbed:MusicLoop",
          msgint,
          { Emoji: Emojis.success }
        );
    }
    return baseEmbed
      .setThumbnail(music.info.artworkUrl)
      .setTitle(
        await this.client.Translate.Guild(
          "Tools/Music:NowPlayingEmbed:Title",
          msgint
        )
      )
      .setDescription(`[${music.info.title}](${music.info.uri})`)
      .setFields([
        {
          name: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:1",
            msgint
          ),
          value: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:Content:1",
            msgint,
            { Author: music.info.author }
          ),
          inline: true
        },
        {
          name: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:2",
            msgint
          ),
          value: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:Content:2",
            msgint,
            {
              IsPlaying: player.playing
                ? await this.client.Translate.Guild(
                    "Tools/Music:NowPlayingEmbed:Playing",
                    msgint,
                    { Emoji: Emojis.success }
                  )
                : await this.client.Translate.Guild(
                    "Tools/Music:NowPlayingEmbed:Paused",
                    msgint,
                    { Emoji: Emojis.fail }
                  )
            }
          ),
          inline: true
        },
        {
          name: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:3",
            msgint
          ),
          value: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:Content:3",
            msgint,
            {
              IsBassBoosted: player.filterManager.equalizerBands
                ? await this.client.Translate.Guild(
                    "Tools/Music:NowPlayingEmbed:ActiveBass",
                    msgint,
                    { Emoji: Emojis.success }
                  )
                : await this.client.Translate.Guild(
                    "Tools/Music:NowPlayingEmbed:NoBass",
                    msgint,
                    { Emoji: Emojis.fail }
                  )
            }
          ),
          inline: true
        },
        {
          name: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:4",
            msgint
          ),
          value: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:Content:4",
            msgint,
            {
              IsLoop
            }
          ),
          inline: true
        },
        {
          name: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:5",
            msgint
          ),
          value: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:Content:5",
            msgint,
            { Volume: player.volume }
          ),
          inline: true
        },
        {
          name: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:6",
            msgint
          ),
          value: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:Content:6",
            msgint,
            { Duration: await MusicTools.ProgressBar(player) }
          ),
          inline: false
        }
      ])
      .setFooter({
        text: msgint.guild.name,
        iconURL: msgint.guild.iconURL()
      });
  }
}
