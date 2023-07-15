import { Config, Emojis, URLList } from "@/Config/Config";
import NDBClient from "@/Core/NDBClient";
import {
  CommandInteractionOptionResolver,
  GuildMember,
  VoiceChannel
} from "discord.js";

export default class MusicTools {
  public static async getPlayer(client: NDBClient, guildId: string) {
    return client.ErelaManager.players.get(guildId);
  }

  public static async createPlayer(
    client: NDBClient,
    voiceChannel: VoiceChannel,
    textChannelId: string
  ) {
    return client.ErelaManager.create({
      guild: voiceChannel.guildId,
      textChannel: textChannelId,
      voiceChannel: voiceChannel.id,
      selfDeafen: Config.Music.Client.selfDeaf,
      region: voiceChannel.rtcRegion || undefined,
      instaUpdateFiltersFix: false
    });
  }

  public static hasVoice(member: GuildMember): boolean {
    return !!member.voice.channel;
  }

  public static async Checker(
    args: Array<string> | CommandInteractionOptionResolver,
    isSlash: boolean
  ) {
    const URLs = URLList.Music;
    const MusicEmojis = Emojis.Music;
    var Emoji: string;
    var Name: string;

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
    return { Emoji, Name };
  }
}
