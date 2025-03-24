import { Logger } from "@nestjs/common";
import { isURL } from "class-validator";
import { SourceLinksRegexes, type SourceNames } from "lavalink-client";
import { emojisConfig, musicConfig } from "../config";

export class MusicService {
	private readonly logger = new Logger(MusicService.name);

	public static isValidSourceURL(url: string): boolean {
		if (!isURL(url)) return false;
		for (const regex of Object.values(SourceLinksRegexes)) {
			if (regex.test(url)) return true;
		}
	}

	public static async getSource(url: string) {
		if (!MusicService.isValidSourceURL(url)) return;

		const { URLList: URLs } = musicConfig;
		const { youtube: YoutubeEmoji, spotify: SpotifyEmoji } = emojisConfig;
		const defaultSource = { Name: "Youtube", Emoji: YoutubeEmoji };

		const Props = [
			{ URL: URLs.Youtube, Name: "Youtube", Emoji: YoutubeEmoji },
			{ URL: URLs.ShortYoutube, Name: "Youtube", Emoji: YoutubeEmoji },
			{ URL: URLs.Spotify, Name: "Spotify", Emoji: SpotifyEmoji },
		];

		const source =
			Props.find((value) => url.includes(value.URL)) || defaultSource;
		return { Emoji: source.Emoji, Name: source.Name };
	}

	public static formatSourceName(sourceName: SourceNames): string {
		const sourceNamesMap: Record<SourceNames, string> = {
			youtube: "Youtube",
			youtubemusic: "Youtube Music",
			soundcloud: "SoundCloud",
			bandcamp: "Bandcamp",
			twitch: "Twitch",
			deezer: "Deezer",
			spotify: "Spotify",
			applemusic: "Apple Music",
			yandexmusic: "Yandex Music",
			"flowery-tts": "Flowery TTS",
			jiosaavn: "JioSaavn",
		};

		return sourceNamesMap[sourceName] || "Unknown Source";
	}
}
