import type { Config } from "@/modules/config/types";
import type { IDatabaseService } from "@/modules/database/interfaces/IDatabaseService";
import { Services } from "@/types/Constants";
import {
    LOCALIZATION_ADAPTER,
    type NestedLocalizationAdapter,
} from "@necord/localization";
import { Inject, Injectable } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import {
    channelMention,
    type CommandInteraction,
    type GuildMember,
    type VoiceChannel,
} from "discord.js";
import type { Player, PlayerOptions, SourceNames } from "lavalink-client";
import moment from "moment";
import ms from "parse-ms";
import type { MusicEmbeds } from "./Music.embeds";
import type { MusicManager } from "./Music.manager";
import type { IMusicService } from "./interfaces";
import { Music } from "./types/constants";

@Injectable()
export class MusicService implements IMusicService {
	public constructor(
		@Inject(Music.Manager) private readonly MusicManager: MusicManager,
		@Inject(Music.Embeds) private readonly embeds: MusicEmbeds,
		@Inject(Services.Database) private readonly database: IDatabaseService,
		@Inject(LOCALIZATION_ADAPTER) private readonly translate: NestedLocalizationAdapter,
		private readonly config: ConfigService<Config>,
	) {}

	public async getPlayer(interaction: CommandInteraction): Promise<Player> {
		if (this.getPremium(interaction.guildId)) {
			return this.MusicManager.premium.getPlayer(interaction.guildId);
		}

		return this.MusicManager.common.getPlayer(interaction.guildId);
	}

	public async getPlayerEvent(
		guildId: string,
		isPremium: boolean,
	): Promise<Player> {
		if (isPremium) {
			return this.MusicManager.premium.getPlayer(guildId);
		}

		return this.MusicManager.common.getPlayer(guildId);
	}

	public async createPlayer(
		interaction: CommandInteraction,
		voiceChannel: VoiceChannel,
		textChannelId: string,
	): Promise<Player> {
		const createOptions: PlayerOptions = {
			guildId: voiceChannel.guildId,
			textChannelId: textChannelId,
			voiceChannelId: voiceChannel.id,
			selfDeaf:
				this.config.getOrThrow<Config["Music"]>("Music").Client.selfDeaf,
			instaUpdateFiltersFix: false,
			volume: this.config.getOrThrow<Config["Music"]>("Music").Volumes.Player,
			// vcRegion: voiceChannel.rtcRegion!
		};
		let player: Player;
		if (this.getPremium(interaction.guildId)) {
			player = this.MusicManager.premium.createPlayer(createOptions);
			player.isPremium = true;
		} else {
			player = this.MusicManager.common.createPlayer(createOptions);
			player.isPremium = false;
		}

		return player;
	}

	public async hasVoice(interaction: CommandInteraction): Promise<boolean> {
		if (!(interaction.member as GuildMember).voice.channel) {
			await interaction.reply({
				embeds: [await this.embeds.NoChannel(interaction)],
			});

			return false;
		}
		return true;
	}

	public async sameVoice(interaction: CommandInteraction): Promise<boolean> {
		const player = await this.getPlayer(interaction);
		const voiceChannel = await interaction.guild.channels.fetch(
			player.voiceChannelId,
		);

		if (
			(interaction.member as GuildMember).voice.channelId !==
			player.voiceChannelId
		) {
			await interaction.reply(
				this.translate.getTranslation(
					"Tools.Music.WrongChannel",
					interaction.guildLocale,
					{
						TextChannel: channelMention(player.textChannelId),
						VoiceChannel: channelMention(voiceChannel.id),
					},
				),
			);
			return false;
		}
		return true;
	}

	public async hasPlayer(interaction: CommandInteraction): Promise<boolean> {
		const player = await this.getPlayer(interaction);
		if (!player) {
			await interaction.reply({
				embeds: [await this.embeds.NoPlayer(interaction)],
			});
			return false;
		}
		return true;
	}

	public async checkers(interaction: CommandInteraction): Promise<boolean> {
		if (!(await this.hasPlayer(interaction))) {
			return false;
		}

		if (!(await this.hasVoice(interaction))) {
			return false;
		}

		if (!(await this.sameVoice(interaction))) {
			return false;
		}

		return true;
	}

	public async URLChecker(
		isCommand: boolean,
		query: CommandInteraction | string,
	): Promise<{
		Emoji: string;
		Name: string;
	}> {
		const URLs = this.config.getOrThrow<Config["URLList"]>("URLList").Music;
		const MusicEmojis =
			this.config.getOrThrow<Config["Emojis"]>("Emojis").Music;
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
				if (
					(
						(query as CommandInteraction).options.get("query").value as string
					).includes(value.URL)
				) {
					Emoji = value.Emoji;
					Name = value.Name;
					break;
				}
				Emoji = MusicEmojis.Youtube;
				Name = "Youtube";
			} else {
				if ((query as string).includes(value.URL)) {
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
			"▬",
		];
		const calcul = Math.round(
			progressBar.length * (D3 / player.queue.current.info.duration),
		);
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

	private async getPremium(guildId: string) {
		return (await this.database.GuildRepo().get(guildId)).Settings.Premium;
	}
}
