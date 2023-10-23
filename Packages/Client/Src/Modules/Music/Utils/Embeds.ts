import { Emojis } from "@/Config/Config";
import { INDBClient } from "@/Types";
import { Context } from "@/Utils/Structures";
import { ColorResolvable, EmbedBuilder } from "discord.js";
import { SearchResult, Track } from "lavalink-client";
import MusicTools from "./Tools";

export default class MusicEmbeds {
  public constructor(private readonly client: INDBClient) {}

  private async createBaseEmbed(
    context: Context,
    color: "Error" | "Success"
  ): Promise<EmbedBuilder> {
    if (color === "Error") var hex = "#c20e00";
    else hex = "#00c26f";
    return new EmbedBuilder()
      .setAuthor({
        name: context.author.username,
        iconURL: context.author.displayAvatarURL()
      })
      .setTimestamp()
      .setColor(hex as ColorResolvable);
  }

  public async NoPlayer(context: Context) {
    const baseEmbed = await this.createBaseEmbed(context, "Error");
    return baseEmbed
      .setTitle(
        await this.client.Translate.Guild(
          "Tools/Music:NoPlayerEmbed:Title",
          context
        )
      )
      .addFields([
        {
          name: await this.client.Translate.Guild(
            "Tools/Music:NoPlayerEmbed:Fields:1",
            context
          ),
          value: await this.client.Translate.Guild(
            "Tools/Music:NoPlayerEmbed:Fields:Content:1",
            context,
            { GuildName: context.guild.name }
          )
        }
      ]);
  }

  public async NoChannel(context: Context): Promise<EmbedBuilder> {
    const baseEmbed = await this.createBaseEmbed(context, "Error");
    return baseEmbed
      .setTitle(
        await this.client.Translate.Guild(
          "Tools/Music:NoChannelEmbed:Title",
          context
        )
      )
      .setDescription(
        await this.client.Translate.Guild(
          "Tools/Music:NoChannelEmbed:Description",
          context
        )
      )
      .setFooter({
        text: await this.client.Translate.Guild(
          "Tools/Music:NoChannelEmbed:Footer",
          context
        ),
        iconURL: this.client.user.displayAvatarURL()
      });
  }

  public async NoArgs(context: Context): Promise<EmbedBuilder> {
    const baseEmbed = await this.createBaseEmbed(context, "Error");
    return baseEmbed
      .setTitle(
        await this.client.Translate.Guild(
          "Tools/Music:NoArgsEmbed:Title",
          context
        )
      )
      .setDescription(
        await this.client.Translate.Guild(
          "Tools/Music:NoArgsEmbed:Description",
          context
        )
      )
      .setFooter({
        text: await this.client.Translate.Guild(
          "Tools/Music:NoArgsEmbed:Footer",
          context
        ),
        iconURL: this.client.user.displayAvatarURL()
      });
  }

  public async LoadType(
    context: Context,
    loadType: string,
    track?: Track
  ): Promise<EmbedBuilder> {
    const Checker = await MusicTools.URLChecker(true, context);
    const baseEmbed = await this.createBaseEmbed(context, "Error");
    switch (loadType) {
      case "Fail":
        baseEmbed
          .setTitle(
            await this.client.Translate.Guild(
              "Tools/Music:loadType:LOAD_FAILED:Embed:Title",
              context
            )
          )
          .setDescription(
            await this.client.Translate.Guild(
              "Tools/Music:loadType:LOAD_FAILED:Embed:Description",
              context
            )
          )
          .setFooter({
            text: await this.client.Translate.Guild(
              "Tools/Music:loadType:LOAD_FAILED:Embed:Footer",
              context
            ),
            iconURL: this.client.user.displayAvatarURL()
          });

        break;
      case "NoMatches":
        baseEmbed
          .setTitle(
            await this.client.Translate.Guild(
              "Tools/Music:loadType:NO_MATCHES:Embed:Title",
              context
            )
          )
          .setDescription(
            await this.client.Translate.Guild(
              "Tools/Music:loadType:NO_MATCHES:Embed:Description",
              context
            )
          )
          .setFooter({
            text: await this.client.Translate.Guild(
              "Tools/Music:loadType:NO_MATCHES:Embed:Footer",
              context
            ),
            iconURL: this.client.user.displayAvatarURL()
          });

        break;
      case "Success":
        const Timer = await this.client.Tools.Timer(
          "normal",
          track.info.duration,
          context
        );
        baseEmbed
          .setColor("#00c26f")
          .setTitle(
            await this.client.Translate.Guild(
              "Tools/Music:loadType:SUCCESS:Embed:Title",
              context
            )
          )
          .addFields([
            {
              name: await this.client.Translate.Guild(
                "Tools/Music:loadType:SUCCESS:Embed:Fields:1",
                context,
                { EMOJI: Checker.Emoji, NAME: Checker.Name }
              ),
              value: await this.client.Translate.Guild(
                "Tools/Music:loadType:SUCCESS:Embed:Fields:Content:1",
                context,
                { TITLE: track.info.title, URI: track.info.uri }
              ),
              inline: true
            },
            {
              name: await this.client.Translate.Guild(
                "Tools/Music:loadType:SUCCESS:Embed:Fields:2",
                context
              ),
              value: await this.client.Translate.Guild(
                "Tools/Music:loadType:SUCCESS:Embed:Fields:Content:2",
                context,
                { AUTHOR: track.info.author }
              ),
              inline: true
            },
            {
              name: await this.client.Translate.Guild(
                "Tools/Music:loadType:SUCCESS:Embed:Fields:3",
                context
              ),
              value: await this.client.Translate.Guild(
                "Tools/Music:loadType:SUCCESS:Embed:Fields:Content:3",
                context,
                { TIMER: Timer }
              ),
              inline: true
            }
          ])
          .setThumbnail(track.info.artworkUrl)
          .setFooter({
            text: await this.client.Translate.Guild(
              "Tools/Music:loadType:SUCCESS:Embed:Footer",
              context
            ),
            iconURL: this.client.user.displayAvatarURL()
          });

        break;
    }

    return baseEmbed;
  }

  public async Playlist(
    context: Context,
    res: SearchResult,
    url: string
  ): Promise<EmbedBuilder> {
    const Checker = await MusicTools.URLChecker(
      true,
      context.getArg("query", -1)
    );
    const Timer = await this.client.Tools.Timer(
      "normal",
      res.playlist.duration,
      context
    );
    const baseEmbed = await this.createBaseEmbed(context, "Success");
    return baseEmbed
      .setTitle(
        await this.client.Translate.Guild(
          "Tools/Music:loadType:SUCCESS:Embed:PlaylistTitle",
          context
        )
      )
      .setThumbnail(res.playlist.thumbnail)
      .addFields([
        {
          name: await this.client.Translate.Guild(
            "Tools/Music:loadType:SUCCESS:Embed:Fields:1",
            context,
            { EMOJI: Checker.Emoji, NAME: Checker.Name }
          ),
          value: await this.client.Translate.Guild(
            "Tools/Music:loadType:SUCCESS:Embed:Fields:Content:1",
            context,
            // eslint-disable-next-line no-inline-comments
            { TITLE: res.playlist.name, URI: url /* res.playlist.uri */ }
          ),
          inline: true
        },
        {
          name: await this.client.Translate.Guild(
            "Tools/Music:loadType:SUCCESS:Embed:Fields:2",
            context
          ),
          value: await this.client.Translate.Guild(
            "Tools/Music:loadType:SUCCESS:Embed:Fields:Content:2",
            context,
            // eslint-disable-next-line no-inline-comments
            { AUTHOR: res.tracks[0].info.author /* res.playlist.author */ }
          ),
          inline: true
        },
        {
          name: await this.client.Translate.Guild(
            "Tools/Music:loadType:SUCCESS:Embed:Fields:3",
            context
          ),
          value: await this.client.Translate.Guild(
            "Tools/Music:loadType:SUCCESS:Embed:Fields:Content:3",
            context,
            { TIMER: Timer }
          ),
          inline: true
        }
      ])
      .setFooter({
        text: await this.client.Translate.Guild(
          "Tools/Music:loadType:SUCCESS:Embed:Footer",
          context
        ),
        iconURL: this.client.user.displayAvatarURL()
      });
  }

  public async NowPlaying(context: Context): Promise<EmbedBuilder> {
    const baseEmbed = await this.createBaseEmbed(context, "Success");
    const player = await MusicTools.getPlayer(context);
    const music = player.queue.current;
    let IsLoop: string;
    switch (player.repeatMode) {
      case "off":
        IsLoop = await this.client.Translate.Guild(
          "Tools/Music:NowPlayingEmbed:NoLoop",
          context,
          { Emoji: Emojis.fail }
        );
        break;
      case "queue":
        IsLoop = await this.client.Translate.Guild(
          "Tools/Music:NowPlayingEmbed:QueueLoop",
          context,
          { Emoji: Emojis.success }
        );
      case "track":
        IsLoop = await this.client.Translate.Guild(
          "Tools/Music:NowPlayingEmbed:MusicLoop",
          context,
          { Emoji: Emojis.success }
        );
    }
    return baseEmbed
      .setThumbnail(music.info.artworkUrl)
      .setTitle(
        await this.client.Translate.Guild(
          "Tools/Music:NowPlayingEmbed:Title",
          context
        )
      )
      .setDescription(`[${music.info.title}](${music.info.uri})`)
      .setFields([
        {
          name: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:1",
            context
          ),
          value: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:Content:1",
            context,
            { Author: music.info.author }
          ),
          inline: true
        },
        {
          name: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:2",
            context
          ),
          value: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:Content:2",
            context,
            {
              IsPlaying: player.playing
                ? await this.client.Translate.Guild(
                    "Tools/Music:NowPlayingEmbed:Playing",
                    context,
                    { Emoji: Emojis.success }
                  )
                : await this.client.Translate.Guild(
                    "Tools/Music:NowPlayingEmbed:Paused",
                    context,
                    { Emoji: Emojis.fail }
                  )
            }
          ),
          inline: true
        },
        {
          name: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:3",
            context
          ),
          value: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:Content:3",
            context,
            {
              IsBassBoosted: player.filterManager.equalizerBands
                ? await this.client.Translate.Guild(
                    "Tools/Music:NowPlayingEmbed:ActiveBass",
                    context,
                    { Emoji: Emojis.success }
                  )
                : await this.client.Translate.Guild(
                    "Tools/Music:NowPlayingEmbed:NoBass",
                    context,
                    { Emoji: Emojis.fail }
                  )
            }
          ),
          inline: true
        },
        {
          name: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:4",
            context
          ),
          value: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:Content:4",
            context,
            {
              IsLoop
            }
          ),
          inline: true
        },
        {
          name: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:5",
            context
          ),
          value: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:Content:5",
            context,
            { Volume: player.volume }
          ),
          inline: true
        },
        {
          name: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:6",
            context
          ),
          value: await this.client.Translate.Guild(
            "Tools/Music:NowPlayingEmbed:Fields:Content:6",
            context,
            { Duration: await MusicTools.ProgressBar(player) }
          ),
          inline: false
        }
      ])
      .setFooter({
        text: context.guild.name,
        iconURL: context.guild.iconURL()
      });
  }
}
