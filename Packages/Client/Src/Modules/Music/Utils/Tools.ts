import { Config, Emojis, URLList } from "@/Config/Config";
import NDBClient from "@/Core/NDBClient";
import { INDBClient, SwitchCommand } from "@/Types";
import { InteractionTools, MessageTools } from "@/Utils/Tools";
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  Message,
  VoiceChannel,
  channelMention
} from "discord.js";
import { Player, PlayerOptions, SourceNames } from "lavalink-client";
import moment from "moment";
import ms from "parse-ms";
import MusicEmbeds from "./Embeds";

export default class MusicTools {
  public static async getPlayer(
    client: INDBClient,
    guildId: string,
    isPremium: boolean
  ) {
    let player: Player;
    if (isPremium) {
      player = client.MusicManager.premium.getPlayer(guildId);
    } else if (isPremium === false) {
      player = client.MusicManager.common.getPlayer(guildId);
    }

    return player;
  }

  public static async createPlayer(
    client: INDBClient,
    voiceChannel: VoiceChannel,
    textChannelId: string,
    isPremium: boolean
  ) {
    const createOptions: PlayerOptions = {
      guildId: voiceChannel.guildId,
      textChannelId: textChannelId,
      voiceChannelId: voiceChannel.id,
      selfDeaf: Config.Music.Client.selfDeaf,
      instaUpdateFiltersFix: false,
      volume: Config.Music.Volumes.Player
      // vcRegion: voiceChannel.rtcRegion!
    };
    let player: Player;
    if (isPremium) {
      player = client.MusicManager.premium.createPlayer(createOptions);
      player.isPremium = true;
    } else {
      player = client.MusicManager.common.createPlayer(createOptions);
      player.isPremium = false;
    }

    return player;
  }

  public static async hasVoice(
    { MsgInt }: SwitchCommand,
    isSlash: boolean
  ): Promise<boolean> {
    const Embeds = new MusicEmbeds(MsgInt.client as NDBClient);
    if (!(MsgInt.member as GuildMember).voice.channel) {
      if (isSlash) {
        MsgInt = MsgInt as CommandInteraction;
        InteractionTools.reply(MsgInt, await Embeds.NoChannel(MsgInt), false);
      } else {
        MsgInt = MsgInt as Message;
        MessageTools.reply(MsgInt, await Embeds.NoChannel(MsgInt));
      }
      return false;
    }
    return true;
  }

  public static async sameVoice(
    player: Player,
    { MsgInt }: SwitchCommand,
    isSlash: boolean
  ) {
    const client = MsgInt.client as NDBClient;
    const voiceChannel = await MsgInt.guild.channels.fetch(
      player.voiceChannelId
    );

    if (
      (MsgInt.member as GuildMember).voice.channelId !== player.voiceChannelId
    ) {
      if (isSlash) {
        MsgInt = MsgInt as CommandInteraction;

        InteractionTools.reply(
          MsgInt,
          await client.Translate.Guild("Tools/Music:WrongChannel", MsgInt, {
            TextChannel: channelMention(player.textChannelId),
            VoiceChannel: channelMention(voiceChannel.id)
          }),
          false
        );
      } else {
        MsgInt = MsgInt as Message;
        MessageTools.reply(
          MsgInt,
          await client.Translate.Guild("Tools/Music:WrongChannel", MsgInt, {
            TextChannel: channelMention(player.textChannelId),
            VoiceChannel: channelMention(voiceChannel.id)
          })
        );
      }
      return false;
    }
    return true;
  }

  public static async HasPlayer(
    player: Player,
    client: INDBClient,
    { MsgInt }: SwitchCommand,
    isSlash: boolean
  ) {
    if (!player) {
      const embed = await new MusicEmbeds(client).NoPlayer(MsgInt);
      if (isSlash) {
        InteractionTools.reply(MsgInt as CommandInteraction, embed, false);
        return false;
      } else {
        MessageTools.reply(MsgInt as Message, embed);
        return false;
      }
    }
    return true;
  }

  public static async Checkers(
    player: Player,
    { MsgInt }: SwitchCommand,
    isSlash: boolean
  ) {
    if (
      !(await MusicTools.HasPlayer(
        player,
        MsgInt.client as NDBClient,
        {
          MsgInt
        },
        isSlash
      ))
    ) {
      return false;
    }

    if (!(await MusicTools.hasVoice({ MsgInt }, isSlash))) {
      return false;
    }

    if (!(await MusicTools.sameVoice(player, { MsgInt }, isSlash))) {
      return false;
    }

    return true;
  }

  public static async URLChecker(
    isCommand: boolean,
    args?: string | Array<string> | CommandInteractionOptionResolver,
    isSlash?: boolean
  ) {
    const URLs = URLList.Music;
    const MusicEmojis = Emojis.Music;
    let Emoji: string;
    let Name: string;

    const Props = [
      { URL: URLs.Youtube, Name: "Youtube", Emoji: MusicEmojis.Youtube },
      { URL: URLs.ShortYoutube, Name: "Youtube", Emoji: MusicEmojis.Youtube },
      { URL: URLs.Spotify, Name: "Spotify", Emoji: MusicEmojis.Spotify },
      {
        URL: URLs.SoundCloud,
        Name: "Soundcloud",
        Emoji: MusicEmojis.SoundCloud
      },
      { URL: URLs.Deezer, Name: "Deezer", Emoji: MusicEmojis.Deezer },
      { URL: URLs.Facebook, Name: "Facebook", Emoji: MusicEmojis.Facebook },
      { URL: URLs.Apple, Name: "Apple Music", Emoji: MusicEmojis.Apple }
    ];
    if (isCommand) {
      for (const value of Props) {
        const Query = isSlash
          ? ((args as CommandInteractionOptionResolver).get("query")
              .value as string)
          : (args as Array<string>).join(" ");
        if (Query.includes(value.URL)) {
          Emoji = value.Emoji;
          Name = value.Name;
          break;
        } else {
          Emoji = MusicEmojis.Youtube;
          Name = "Youtube";
        }
      }
    } else {
      for (const value of Props) {
        if ((args as string).includes(value.URL)) {
          Emoji = value.Emoji;
          Name = value.Name;
          break;
        }
      }
    }
    return { Emoji, Name };
  }

  public static async ProgressBar(player: Player) {
    const time = ms(player.queue.current.info.duration);
    const done = ms(player.position);
    const D1 = `[${
      done.hours ? (done.hours > 10 ? done.hours : `0${done.hours}`) : ""
    }${
      done.minutes
        ? done.minutes >= 10
          ? done.minutes
          : `0${done.minutes}`
        : "00"
    }:${
      done.seconds
        ? done.seconds > 10
          ? done.seconds
          : `0${done.seconds}`
        : ""
    }] `;
    const D2 = ` [${
      time.hours ? (time.hours > 10 ? time.hours : `0${time.hours}`) : ""
    }${time.hours ? ":" : ""}${
      time.minutes
        ? time.minutes >= 10
          ? time.minutes
          : `0${time.minutes}`
        : "00"
    }:${
      time.seconds
        ? time.seconds > 10
          ? time.seconds
          : `0${time.seconds}`
        : ""
    }]`;
    const D3 = moment.duration({ ms: player.position }).asMilliseconds();
    const progressBar = [
      "▬",
      "▬",
      "▬",
      "▬",
      "▬",
      "▬",
      "▬",
      "▬",
      "▬",
      "▬",
      "▬",
      "▬",
      "▬",
      "▬"
    ];
    const calcul = Math.round(
      progressBar.length * (D3 / player.queue.current.info.duration)
    );
    progressBar[calcul] = "🔘";
    return D1 + progressBar.join("") + D2;
  }

  public static formatSourceName(sourceName: SourceNames): string {
    switch (sourceName) {
      case "youtube":
        return "Youtube";
      case "youtubemusic":
        return "Youtube Music";
      case "soundcloud":
        return "SoundCloud";
      case "bandcamp":
        return "Bandcamp";
      case "twitch":
        return "Twitch";
      case "deezer":
        return "Deezer";
      case "spotify":
        return "Spotify";
      case "applemusic":
        return "Apple Music";
      case "yandexmusic":
        return "Yandex Music";
      case "flowery-tts":
        return "Flowery TTS";
    }
  }
}
