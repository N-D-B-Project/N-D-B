import { Context } from "@/Utils/Structures";
import { EmbedBuilder, Message, VoiceChannel } from "discord.js";
import { LavalinkManager, Player, SearchResult } from "lavalink-client";
import MusicEmbeds from "./Embeds";
import MusicTools from "./Tools";

export default class Play {
  public static async run(context: Context): Promise<EmbedBuilder | Message> {
    const Embeds = new MusicEmbeds(context.client);
    const Search = context.getArg("query", -1);
    let res: SearchResult;

    if (!(await MusicTools.hasVoice(context))) {
      return;
    }

    let player = await MusicTools.getPlayer(context);

    if (!player) {
      player = await MusicTools.createPlayer(
        context,
        (await context.getMember()).voice.channel as VoiceChannel,
        context.channel.id
      );
    }
    if (!player.connected) {
      player.slash = { isSlash: false };
      player.playerAuthor = context.author.id;
      await player.connect();
    }

    if (!(await MusicTools.sameVoice(context))) {
      return;
    }

    if (!Search) {
      return context.reply(await Embeds.NoArgs(context));
    }

    if (context.client.Tools.isValidURL(Search)) {
      res = (await player.search(Search, context.author.id)) as SearchResult;
    } else {
      res = (await player.search(
        {
          query: Search
        },
        context.author
      )) as SearchResult;
    }

    return await this.LoadType(res, player, context);
  }

  private static async LoadType(
    res: SearchResult,
    player: Player,
    context: Context
  ) {
    const Embeds = new MusicEmbeds(context.client);
    let Embed: EmbedBuilder;
    switch (res.loadType) {
      case "error":
        if (!player.queue.current) player.destroy();
        Embed = await Embeds.LoadType(context, "Fail");
        break;
      case "empty":
        if (!player.queue.current) player.destroy();
        Embed = await Embeds.LoadType(context, "NoMatches");
        break;
      case "search":
      case "track":
        if (!player.connected) {
          player.playerMessage = context.id;
          player.playerAuthor = context.author.id;
          await player.connect();
        }
        if (!player.playing) {
          await player.queue.add(res.tracks[0]);
          await player.play({ paused: false });
          if (!player.paused && !player.playing) await player.resume();
        } else {
          await player.queue.add(res.tracks[0]);
        }

        Embed = await Embeds.LoadType(context, "Success", res.tracks[0]);
        break;
      case "playlist":
        Embed = await this.Playlist(res, player, context);
        break;
    }

    return Embed;
  }

  private static async Playlist(
    res: SearchResult,
    player: Player,
    context: Context
  ): Promise<EmbedBuilder> {
    const Embeds = new MusicEmbeds(context.client);
    const URL = context.getArg("query", -1);
    let isValidURL: boolean = false;
    for (const regex of Object.values(LavalinkManager.SourceLinksRegexes)) {
      if (regex.test(URL)) {
        isValidURL = true;
        break;
      }
    }

    if (isValidURL) {
      if (!player.playing) {
        await player.queue.add(res.tracks);
        await player.play({ paused: false });
      } else {
        await player.queue.add(res.tracks[0]);
      }
      if (!player.paused && !player.playing) {
        await player.play({ paused: false });
      }
      return await Embeds.Playlist(context, res, URL);
    }
  }
}
