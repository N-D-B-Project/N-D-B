import NDBClient from "@/Core/NDBClient";
import { SwitchCommand } from "@/Types";
import { InteractionTools, MessageTools } from "@/Utils/Tools";
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  GuildMember,
  Message,
  User,
  VoiceChannel
} from "discord.js";
import { LavalinkManager, Player, SearchResult } from "lavalink-client";
import MusicEmbeds from "./Embeds";
import MusicTools from "./Tools";

export default class Play {
  public static async _Legacy(
    message: Message,
    args: Array<string>,
    isPremium: boolean
  ): Promise<EmbedBuilder | Message> {
    const client = message.client as NDBClient;
    const Embeds = new MusicEmbeds(message.client as NDBClient);
    const Search = args.join(" ");
    let res: SearchResult;

    if (!(await MusicTools.hasVoice({ MsgInt: message }, false))) {
      return;
    }

    let player = await MusicTools.getPlayer(client, message.guildId, isPremium);

    if (!player) {
      player = await MusicTools.createPlayer(
        client,
        message.member.voice.channel as VoiceChannel,
        message.channelId,
        isPremium
      );
    }
    if (!player.connected) {
      player.slash = { isSlash: false };
      player.playerAuthor = message.author.id;
      await player.connect();
    }

    if (!(await MusicTools.sameVoice(player, { MsgInt: message }, false))) {
      return;
    }

    if (!Search) {
      return MessageTools.reply(message, await Embeds.NoArgs(message));
    }

    if ((message.client as NDBClient).Tools.isValidURL(Search)) {
      res = await player.search(Search, message.author.id);
    } else {
      res = await player.search(
        {
          query: Search
        },
        message.author
      );
    }

    return await this.LoadType(res, player, { MsgInt: message, args }, false);
  }

  public static async _Slash(
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver,
    isPremium: boolean
  ): Promise<EmbedBuilder | Message> {
    const Embeds = new MusicEmbeds(interaction.client as NDBClient);
    const Search = args.getString("query");
    let res: SearchResult;

    let player = await MusicTools.getPlayer(
      interaction.client as NDBClient,
      interaction.guildId,
      isPremium
    );

    if (!(await MusicTools.hasVoice({ MsgInt: interaction }, true))) {
      return;
    }

    if (!(await MusicTools.sameVoice(player, { MsgInt: interaction }, true))) {
      return;
    }

    if (!Search) {
      return InteractionTools.reply(
        interaction,
        await Embeds.NoArgs(interaction),
        false
      );
    }

    if (!player) {
      player = await MusicTools.createPlayer(
        interaction.client as NDBClient,
        (interaction.member as GuildMember).voice.channel as VoiceChannel,
        interaction.channelId,
        isPremium
      );
    }

    if (!player.connected) {
      player.slash = { isSlash: true, interaction };
      player.playerAuthor = interaction.member.user.id;
      await player.connect();
    }

    if ((interaction.client as NDBClient).Tools.isValidURL(Search)) {
      res = await player.search(Search, interaction.member.user.id);
    } else {
      res = await player.search(
        {
          query: Search
        },
        interaction.member.user.id
      );
    }

    return await this.LoadType(
      res,
      player,
      { MsgInt: interaction, args },
      true
    );
  }

  private static async LoadType(
    res: SearchResult,
    player: Player,
    { MsgInt, args }: SwitchCommand,
    isSlash: boolean
  ) {
    const Embeds = new MusicEmbeds(MsgInt.client as NDBClient);
    let Embed: EmbedBuilder;
    switch (res.loadType) {
      case "error":
        if (!player.queue.current) player.destroy();
        Embed = await Embeds.LoadType(MsgInt, "Fail");
        break;
      case "empty":
        if (!player.queue.current) player.destroy();
        Embed = await Embeds.LoadType(MsgInt, "NoMatches");
        break;
      case "search":
      case "track":
        if (!player.connected) {
          player.playerMessage = (MsgInt as Message).id;
          player.playerAuthor = (MsgInt.member.user as User).id;
          await player.connect();
        }
        if (!player.playing) {
          await player.queue.add(res.tracks[0]);
          await player.play({ paused: false });
          if (!player.paused && !player.playing) await player.resume();
        } else {
          await player.queue.add(res.tracks[0]);
        }

        Embed = await Embeds.LoadType(
          MsgInt,
          "Success",
          args,
          isSlash,
          res.tracks[0]
        );
        break;
      case "playlist":
        Embed = await this.Playlist(res, player, { MsgInt, args }, isSlash);
        break;
    }

    return Embed;
  }

  private static async Playlist(
    res: SearchResult,
    player: Player,
    { MsgInt, args }: SwitchCommand,
    isSlash: boolean
  ): Promise<EmbedBuilder> {
    const Embeds = new MusicEmbeds(MsgInt.client as NDBClient);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const URL = isSlash
      ? (args as CommandInteractionOptionResolver).getString("query")
      : (args as Array<string>).join(" ");
    let isValidURL: boolean = false;
    for (const regex of Object.values(LavalinkManager.SourceLinksRegexes)) {
      if (regex.test(URL)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      return await Embeds.Playlist(MsgInt, args, isSlash, res, URL);
    }
  }
}
