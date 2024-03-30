import type { Ii18nService } from "@/modules/bot/i18n/interfaces/Ii18nService";
import { Config } from "@/modules/config/types";
import { Extends } from "@/types/Constants";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { VoiceChannel, channelMention } from "discord.js";
import { Player, PlayerOptions, SourceNames } from "lavalink-client";
import moment from "moment";
import ms from "parse-ms";
import { Context } from "../commands/Commands.context";
import { MusicEmbeds } from "./Music.embeds";
import { MusicManager } from "./Music.manager";
import type { IMusicService } from "./interfaces";
import { Music } from "./types/constants";

@Injectable()
export class MusicService implements IMusicService {
	public constructor(
		@Inject(Music.Manager) private readonly MusicManager: MusicManager,
		@Inject(Music.Embeds) private readonly embeds: MusicEmbeds,
		@Inject(Extends.Translate) private readonly Translate: Ii18nService,
		private readonly config: ConfigService<Config>,
	) {}

	public async getPlayer(context: Context): Promise<Player> {
		if (context.isPremium) {
			return this.MusicManager.premium.getPlayer(context.guild.id);
		}

		return this.MusicManager.common.getPlayer(context.guild.id);
	}

	public async getPlayerEvent(guildId: string, isPremium: boolean): Promise<Player> {
		if (isPremium) {
			return this.MusicManager.premium.getPlayer(guildId);
		}

		return this.MusicManager.common.getPlayer(guildId);
	}

	public async createPlayer(context: Context, voiceChannel: VoiceChannel, textChannelId: string): Promise<Player> {
		const createOptions: PlayerOptions = {
			guildId: voiceChannel.guildId,
			textChannelId: textChannelId,
			voiceChannelId: voiceChannel.id,
			selfDeaf: this.config.getOrThrow<Config["Music"]>("Music").Client.selfDeaf,
			instaUpdateFiltersFix: false,
			volume: this.config.getOrThrow<Config["Music"]>("Music").Volumes.Player,
			// vcRegion: voiceChannel.rtcRegion!
		};
		let player: Player;
		if (context.isPremium) {
			player = this.MusicManager.premium.createPlayer(createOptions);
			player.isPremium = true;
		} else {
			player = this.MusicManager.common.createPlayer(createOptions);
			player.isPremium = false;
		}

		return player;
	}

	public async hasVoice(context: Context): Promise<boolean> {
		if (!(await context.getMember()).voice.channel) {
			await context.reply(await this.embeds.NoChannel(context));

			return false;
		}
		return true;
	}

	public async sameVoice(context: Context): Promise<boolean> {
		const player = await this.getPlayer(context);
		const voiceChannel = await context.guild.channels.fetch(player.voiceChannelId);

		if ((await context.getMember()).voice.channelId !== player.voiceChannelId) {
			await context.reply(
				await this.Translate.Guild(context, "Tools/Music:WrongChannel", {
					TextChannel: channelMention(player.textChannelId),
					VoiceChannel: channelMention(voiceChannel.id),
				}),
			);
			return false;
		}
		return true;
	}

	public async hasPlayer(context: Context): Promise<boolean> {
		const player = await this.getPlayer(context);
		if (!player) {
			const embed = await this.embeds.NoPlayer(context);
			await context.reply(embed);
			return false;
		}
		return true;
	}

	public async checkers(context: Context): Promise<boolean> {
		if (!(await this.hasPlayer(context))) {
			return false;
		}

		if (!(await this.hasVoice(context))) {
			return false;
		}

		if (!(await this.sameVoice(context))) {
			return false;
		}

		return true;
	}

	public async URLChecker(
		isCommand: boolean,
		context: Context | string,
	): Promise<{
		Emoji: string;
		Name: string;
	}> {
		const URLs = this.config.getOrThrow<Config["URLList"]>("URLList").Music;
		const MusicEmojis = this.config.getOrThrow<Config["Emojis"]>("Emojis").Music;
		let Emoji: string;
		let Name: string;

		const Props = [
			{ URL: URLs.Youtube, Name: "Youtube", Emoji: MusicEmojis.Youtube },
			{ URL: URLs.ShortYoutube, Name: "Youtube", Emoji: MusicEmojis.Youtube },
			{ URL: URLs.Spotify, Name: "Spotify", Emoji: MusicEmojis.Spotify },
			{
				URL: URLs.SoundCloud,
				Name: "Soundcloud",
				Emoji: MusicEmojis.SoundCloud,
			},
			{ URL: URLs.Deezer, Name: "Deezer", Emoji: MusicEmojis.Deezer },
			{ URL: URLs.Facebook, Name: "Facebook", Emoji: MusicEmojis.Facebook },
			{ URL: URLs.Apple, Name: "Apple Music", Emoji: MusicEmojis.Apple },
			{ URL: URLs.Twitch, Name: "Twitch", Emoji: MusicEmojis.Twitch },
		];

		for (const value of Props) {
			if (isCommand) {
				const Query = (context as Context).getArg("query", -1);
				if (Query.includes(value.URL)) {
					Emoji = value.Emoji;
					Name = value.Name;
					break;
				}
				Emoji = MusicEmojis.Youtube;
				Name = "Youtube";
			} else {
				const args = context as string;
				if (args.includes(value.URL)) {
					Emoji = value.Emoji;
					Name = value.Name;
					break;
				}
			}
		}
		return { Emoji, Name };
	}

	public async progressBar(player: Player): Promise<string> {
		const time = ms(player.queue.current.info.duration);
		const done = ms(player.position);
		const D1 = `[${done.hours ? (done.hours > 10 ? done.hours : `0${done.hours}`) : ""}${
			done.minutes ? (done.minutes >= 10 ? done.minutes : `0${done.minutes}`) : "00"
		}:${done.seconds ? (done.seconds > 10 ? done.seconds : `0${done.seconds}`) : ""}] `;
		const D2 = ` [${time.hours ? (time.hours > 10 ? time.hours : `0${time.hours}`) : ""}${time.hours ? ":" : ""}${
			time.minutes ? (time.minutes >= 10 ? time.minutes : `0${time.minutes}`) : "00"
		}:${time.seconds ? (time.seconds > 10 ? time.seconds : `0${time.seconds}`) : ""}]`;
		const D3 = moment.duration({ ms: player.position }).asMilliseconds();
		const progressBar = ["▬", "▬", "▬", "▬", "▬", "▬", "▬", "▬", "▬", "▬", "▬", "▬", "▬", "▬"];
		const calcul = Math.round(progressBar.length * (D3 / player.queue.current.info.duration));
		progressBar[calcul] = "🔘";
		return D1 + progressBar.join("") + D2;
	}

	public formatSourceName(sourceName: SourceNames): string {
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
