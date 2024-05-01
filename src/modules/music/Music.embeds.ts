import { Config } from "@/modules/shared/config/types";
import { Timer } from "@/utils/Tools";
import { LOCALIZATION_ADAPTER, NestedLocalizationAdapter } from "@necord/localization";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
	Client,
	ColorResolvable,
	CommandInteraction,
	EmbedBuilder,
	Guild,
	TextChannel,
	User,
	VoiceChannel,
	channelMention,
	codeBlock,
} from "discord.js";
import { Player, SearchResult, Track, TrackExceptionEvent } from "lavalink-client";
import type { IMusicEmbeds } from "./interfaces";

@Injectable()
export class MusicEmbeds implements IMusicEmbeds {
	public constructor(
		@Inject(LOCALIZATION_ADAPTER) private readonly translate: NestedLocalizationAdapter,
		private readonly config: ConfigService<Config>,
		private readonly client: Client,
	) {}

	private async createBaseEmbed(interaction: CommandInteraction, color: "Error" | "Success"): Promise<EmbedBuilder> {
		const hex = color === "Error" ? "#c20e00" : "#00c26f";

		return new EmbedBuilder()
			.setAuthor({
				name: interaction.member.user.username,
				iconURL: (interaction.member.user as User).displayAvatarURL(),
			})
			.setTimestamp()
			.setColor(hex as ColorResolvable);
	}

	public async NoPlayer(interaction: CommandInteraction): Promise<EmbedBuilder> {
		const baseEmbed = await this.createBaseEmbed(interaction, "Error");
		return baseEmbed
			.setTitle(this.translate.getTranslation("Tools.Music.NoPlayerEmbed.Title", interaction.guildLocale))
			.addFields([
				{
					name: this.translate.getTranslation("Tools.Music.NoPlayerEmbed.Fields.1", interaction.guildLocale),
					value: this.translate.getTranslation("Tools.Music.NoPlayerEmbed.Fields.Content.1", interaction.guildLocale, {
						GuildName: interaction.guild.name,
					}),
				},
			]);
	}

	public async NoChannel(interaction: CommandInteraction): Promise<EmbedBuilder> {
		const baseEmbed = await this.createBaseEmbed(interaction, "Error");
		return baseEmbed
			.setTitle(this.translate.getTranslation("Tools.Music.NoChannelEmbed.Title", interaction.guildLocale))
			.setDescription(this.translate.getTranslation("Tools.Music.NoChannelEmbed.Description", interaction.guildLocale))
			.setFooter({
				text: this.translate.getTranslation("Tools.Music.NoChannelEmbed.Footer", interaction.guildLocale),
				iconURL: this.client.user.displayAvatarURL(),
			});
	}

	public async LoadType(
		interaction: CommandInteraction,
		loadType: "Fail" | "NoMatches" | "Success",
		Checker: {
			Emoji: string;
			Name: string;
		},
		track?: Track,
	): Promise<EmbedBuilder> {
		const baseEmbed = await this.createBaseEmbed(interaction, "Error");
		switch (loadType) {
			case "Fail":
				baseEmbed
					.setTitle(
						this.translate.getTranslation("Tools.Music.loadType.LOAD_FAILED.Embed.Title", interaction.guildLocale),
					)
					.setDescription(
						this.translate.getTranslation(
							"Tools.Music.loadType.LOAD_FAILED.Embed.Description",
							interaction.guildLocale,
						),
					)
					.setFooter({
						text: this.translate.getTranslation(
							"Tools.Music.loadType.LOAD_FAILED.Embed.Footer",
							interaction.guildLocale,
						),
						iconURL: this.client.user.displayAvatarURL(),
					});

				break;
			case "NoMatches":
				baseEmbed
					.setTitle(
						this.translate.getTranslation("Tools.Music.loadType.NO_MATCHES.Embed.Title", interaction.guildLocale),
					)
					.setDescription(
						this.translate.getTranslation("Tools.Music.loadType.NO_MATCHES.Embed.Description", interaction.guildLocale),
					)
					.setFooter({
						text: this.translate.getTranslation(
							"Tools.Music.loadType.NO_MATCHES.Embed.Footer",
							interaction.guildLocale,
						),
						iconURL: this.client.user.displayAvatarURL(),
					});

				break;
			case "Success":
				baseEmbed
					.setColor("#00c26f")
					.setTitle(this.translate.getTranslation("Tools.Music.loadType.SUCCESS.Embed.Title", interaction.guildLocale))
					.addFields([
						{
							name: this.translate.getTranslation(
								"Tools.Music.loadType.SUCCESS.Embed.Fields.1",
								interaction.guildLocale,
								{
									EMOJI: Checker.Emoji,
									NAME: Checker.Name,
								},
							),
							value: this.translate.getTranslation(
								"Tools.Music.loadType.SUCCESS.Embed.Fields.Content.1",
								interaction.guildLocale,
								{
									TITLE: track.info.title,
									URI: track.info.uri,
								},
							),
							inline: true,
						},
						{
							name: this.translate.getTranslation(
								"Tools.Music.loadType.SUCCESS.Embed.Fields.2",
								interaction.guildLocale,
							),
							value: this.translate.getTranslation(
								"Tools.Music.loadType.SUCCESS.Embed.Fields.Content.2",
								interaction.guildLocale,
								{
									AUTHOR: track.info.author,
								},
							),
							inline: true,
						},
						{
							name: this.translate.getTranslation(
								"Tools.Music.loadType.SUCCESS.Embed.Fields.3",
								interaction.guildLocale,
							),
							value: this.translate.getTranslation(
								"Tools.Music.loadType.SUCCESS.Embed.Fields.Content.3",
								interaction.guildLocale,
								{
									TIMER: await Timer(this.translate, "normal", track.info.duration, interaction.guildLocale),
								},
							),
							inline: true,
						},
					])
					.setThumbnail(track.info.artworkUrl)
					.setFooter({
						text: this.translate.getTranslation("Tools.Music.loadType.SUCCESS.Embed.Footer", interaction.guildLocale),
						iconURL: this.client.user.displayAvatarURL(),
					});

				break;
		}

		return baseEmbed;
	}

	public async Playlist(
		interaction: CommandInteraction,
		res: SearchResult,
		Checker: {
			Emoji: string;
			Name: string;
		},
	): Promise<EmbedBuilder> {
		const baseEmbed = await this.createBaseEmbed(interaction, "Success");
		return baseEmbed
			.setTitle(
				this.translate.getTranslation("Tools.Music.loadType.SUCCESS.Embed.PlaylistTitle", interaction.guildLocale, {
					Quantity: String(res.tracks.length),
				}),
			)
			.setThumbnail(res.playlist.thumbnail)
			.addFields([
				{
					name: this.translate.getTranslation("Tools.Music.loadType.SUCCESS.Embed.Fields.1", interaction.guildLocale, {
						EMOJI: Checker.Emoji,
						NAME: Checker.Name,
					}),
					value: this.translate.getTranslation(
						"Tools.Music.loadType.SUCCESS.Embed.Fields.Content.1",
						interaction.guildLocale,
						{
							TITLE: res.playlist.name ?? res.playlist.title,
							URI: res.playlist.uri,
						},
					),
					inline: true,
				},
				{
					name: this.translate.getTranslation("Tools.Music.loadType.SUCCESS.Embed.Fields.2", interaction.guildLocale),
					value: this.translate.getTranslation(
						"Tools.Music.loadType.SUCCESS.Embed.Fields.Content.2",
						interaction.guildLocale,
						{
							AUTHOR: res.playlist.author,
						},
					),
					inline: true,
				},
				{
					name: this.translate.getTranslation("Tools.Music.loadType.SUCCESS.Embed.Fields.3", interaction.guildLocale),
					value: this.translate.getTranslation(
						"Tools.Music.loadType.SUCCESS.Embed.Fields.Content.3",
						interaction.guildLocale,
						{
							TIMER: await Timer(this.translate, "normal", res.playlist.duration, interaction.guildLocale),
						},
					),
					inline: true,
				},
			])
			.setFooter({
				text: this.translate.getTranslation("Tools.Music.loadType.SUCCESS.Embed.Footer", interaction.guildLocale),
				iconURL: this.client.user.displayAvatarURL(),
			});
	}

	public async NowPlaying(interaction: CommandInteraction, player: Player, progressBar: string): Promise<EmbedBuilder> {
		const baseEmbed = await this.createBaseEmbed(interaction, "Success");
		const music = player.queue.current;
		let IsLoop: string;
		switch (player.repeatMode) {
			case "off":
				IsLoop = this.translate.getTranslation("Tools.Music.NowPlayingEmbed.NoLoop", interaction.guildLocale, {
					Emoji: this.config.getOrThrow<Config["Emojis"]>("Emojis").fail,
				});
				break;
			case "queue":
				IsLoop = this.translate.getTranslation("Tools.Music.NowPlayingEmbed.QueueLoop", interaction.guildLocale, {
					Emoji: this.config.getOrThrow<Config["Emojis"]>("Emojis").success,
				});
				break;
			case "track":
				IsLoop = this.translate.getTranslation("Tools.Music.NowPlayingEmbed.MusicLoop", interaction.guildLocale, {
					Emoji: this.config.getOrThrow<Config["Emojis"]>("Emojis").success,
				});
				break;
		}

		return baseEmbed
			.setThumbnail(music.info.artworkUrl)
			.setTitle(this.translate.getTranslation("Tools.Music.NowPlayingEmbed.Title", interaction.guildLocale))
			.setDescription(`[${music.info.title}](${music.info.uri})`)
			.setFields([
				{
					name: this.translate.getTranslation("Tools.Music.NowPlayingEmbed.Fields:1", interaction.guildLocale),
					value: this.translate.getTranslation(
						"Tools.Music.NowPlayingEmbed.Fields.Content.1",
						interaction.guildLocale,
						{
							Author: music.info.author,
						},
					),
					inline: true,
				},
				{
					name: this.translate.getTranslation("Tools.Music.NowPlayingEmbed.Fields.2", interaction.guildLocale),
					value: this.translate.getTranslation(
						"Tools.Music.NowPlayingEmbed.Fields.Content.2",
						interaction.guildLocale,
						{
							IsPlaying: player.paused
								? this.translate.getTranslation("Tools.Music.NowPlayingEmbed.Paused", interaction.guildLocale, {
										Emoji: this.config.getOrThrow<Config["Emojis"]>("Emojis").fail,
								  })
								: this.translate.getTranslation("Tools.Music.NowPlayingEmbed.Playing", interaction.guildLocale, {
										Emoji: this.config.getOrThrow<Config["Emojis"]>("Emojis").success,
								  }),
						},
					),
					inline: true,
				},
				{
					name: this.translate.getTranslation("Tools.Music.NowPlayingEmbed.Fields.3", interaction.guildLocale),
					value: this.translate.getTranslation(
						"Tools.Music.NowPlayingEmbed.Fields.Content.3",
						interaction.guildLocale,
						{
							IsBassBoosted: player.filterManager.equalizerBands
								? this.translate.getTranslation("Tools.Music.NowPlayingEmbed.ActiveBass", interaction.guildLocale, {
										Emoji: this.config.getOrThrow<Config["Emojis"]>("Emojis").success,
								  })
								: this.translate.getTranslation("Tools/Music:NowPlayingEmbed:NoBass", interaction.guildLocale, {
										Emoji: this.config.getOrThrow<Config["Emojis"]>("Emojis").fail,
								  }),
						},
					),
					inline: true,
				},
				{
					name: this.translate.getTranslation("Tools.Music.NowPlayingEmbed.Fields.4", interaction.guildLocale),
					value: this.translate.getTranslation(
						"Tools.Music.NowPlayingEmbed.Fields.Content.4",
						interaction.guildLocale,
						{
							IsLoop,
						},
					),
					inline: true,
				},
				{
					name: this.translate.getTranslation("Tools.Music.NowPlayingEmbed.Fields.5", interaction.guildLocale),
					value: this.translate.getTranslation(
						"Tools.Music.NowPlayingEmbed.Fields.Content.5",
						interaction.guildLocale,
						{
							Volume: String(player.volume),
						},
					),
					inline: true,
				},
				{
					name: this.translate.getTranslation("Tools.Music.NowPlayingEmbed.Fields.6", interaction.guildLocale),
					value: this.translate.getTranslation(
						"Tools.Music.NowPlayingEmbed.Fields.Content.6",
						interaction.guildLocale,
						{
							Duration: progressBar,
						},
					),
					inline: false,
				},
			])
			.setFooter({
				text: interaction.guild.name,
				iconURL: interaction.guild.iconURL(),
			});
	}

	public async PlayerCreate(
		guild: Guild,
		textChannel: TextChannel,
		voiceChannel: VoiceChannel,
		player: Player,
	): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: guild.name,
				iconURL: guild.iconURL(),
			})
			.setColor("#00c26f")
			.setTitle(this.translate.getTranslation("Events.PlayerEvents.playerCreate.Embed.Title", guild.preferredLocale))
			.setFields([
				{
					name: this.translate.getTranslation("Events.PlayerEvents.playerCreate.Embed.Fields.1", guild.preferredLocale),
					value: this.translate.getTranslation(
						"Events.PlayerEvents.playerCreate.Embed.Fields.Content.1",
						guild.preferredLocale,
						{
							TEXT: channelMention(textChannel.id),
						},
					),
					inline: true,
				},
				{
					name: this.translate.getTranslation("Events.PlayerEvents.playerCreate.Embed.Fields.2", guild.preferredLocale),
					value: this.translate.getTranslation(
						"Events.PlayerEvents.playerCreate.Embed.Fields.Content.2",
						guild.preferredLocale,
						{
							isPremium: player.isPremium
								? this.config.getOrThrow<Config["Emojis"]>("Emojis").accept
								: this.config.getOrThrow<Config["Emojis"]>("Emojis").fail,
						},
					),
					inline: true,
				},
				{
					name: this.translate.getTranslation("Events.PlayerEvents.playerCreate.Embed.Fields.3", guild.preferredLocale),
					value: this.translate.getTranslation(
						"Events.PlayerEvents.playerCreate.Embed.Fields.Content.3",
						guild.preferredLocale,
						{
							VOICE: channelMention(voiceChannel.id),
						},
					),
				},
			])
			.setFooter({
				text: this.translate.getTranslation("Events.PlayerEvents.playerCreate.Embed.Footer", guild.preferredLocale),
				iconURL: this.client.user.displayAvatarURL(),
			})
			.setTimestamp();
	}

	public async PlayerMove(textChannel: TextChannel, voiceChannel: VoiceChannel): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: this.client.user.tag,
				url: this.client.user.displayAvatarURL(),
			})
			.setColor("#00c26f")
			.setTitle(
				this.translate.getTranslation(
					"Events.PlayerEvents.playerMove.KickEmbed.Title",
					textChannel.guild.preferredLocale,
				),
			)
			.setDescription(
				this.translate.getTranslation(
					"Events.PlayerEvents.playerMove.KickEmbed.Description",
					textChannel.guild.preferredLocale,
					{
						CHANNEL: voiceChannel.name,
					},
				),
			)
			.setFooter({
				text: this.translate.getTranslation(
					"Events.PlayerEvents.playerMove.KickEmbed.Footer",
					textChannel.guild.preferredLocale,
				),
			})
			.setTimestamp();
	}

	public async TrackStart(
		textChannel: TextChannel,
		track: Track,
		Requester: User,
		Timer: string,
		Checker: {
			Emoji: string;
			Name: string;
		},
		Platform: string,
	): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: this.client.user.username,
				iconURL: this.client.user.displayAvatarURL(),
			})
			.setTitle(
				this.translate.getTranslation("Events.PlayerEvents.trackStart.Embed.Title", textChannel.guild.preferredLocale, {
					TITLE: track.info.title,
				}),
			)
			.setThumbnail(track.info.artworkUrl)
			.addFields([
				{
					name: this.translate.getTranslation(
						"Events.PlayerEvents.trackStart.Embed.Fields.1",
						textChannel.guild.preferredLocale,
						{
							EMOJI: Checker.Emoji,
							Platform,
						},
					),
					value: `> ${this.translate.getTranslation(
						"Events.PlayerEvents.trackStart.Embed.Fields.Content.1",
						textChannel.guild.preferredLocale,
						{
							URI: track.info.uri,
						},
					)}`,
					inline: true,
				},
				{
					name: this.translate.getTranslation(
						"Events.PlayerEvents.trackStart.Embed.Fields.2",
						textChannel.guild.preferredLocale,
					),
					value: `> ${this.translate.getTranslation(
						"Events.PlayerEvents.trackStart.Embed.Fields.Content.2",
						textChannel.guild.preferredLocale,
						{
							AUTHOR: track.info.author,
						},
					)}`,
					inline: true,
				},
				{
					name: this.translate.getTranslation(
						"Events.PlayerEvents.trackStart.Embed.Fields.3",
						textChannel.guild.preferredLocale,
					),
					value: `> ${
						track.info.isStream
							? this.translate.getTranslation(
									"Events.PlayerEvents.trackStart.Embed.Fields.Content.3²",
									textChannel.guild.preferredLocale,
							  )
							: this.translate.getTranslation(
									"Events.PlayerEvents.trackStart.Embed.Fields.Content.3",
									textChannel.guild.preferredLocale,
									{
										TIMER: Timer,
									},
							  )
					}`,
					inline: true,
				},
			])
			.setColor("#00c26f")
			.setFooter({
				text: this.translate.getTranslation(
					"Events.PlayerEvents.trackStart.Embed.Footer",
					textChannel.guild.preferredLocale,
					{
						REQUESTER: Requester.username,
					},
				),
				iconURL: Requester.displayAvatarURL(),
			})
			.setTimestamp();
	}

	public async TrackError(textChannel: TextChannel, track: Track, payload: string): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: this.client.user.tag,
				url: this.client.user.displayAvatarURL(),
			})
			.setColor("#00c26f")
			.setTitle(
				this.translate.getTranslation("Events.PlayerEvents.trackError.Embed.Title", textChannel.guild.preferredLocale),
			)
			.setDescription(
				this.translate.getTranslation(
					"Events.PlayerEvents.trackError.Embed.Description",
					textChannel.guild.preferredLocale,
					{
						TITLE: track.info.title,
						URI: track.info.uri,
					},
				),
			)
			.addFields([
				{
					name: this.translate.getTranslation(
						"Events.PlayerEvents.trackError.Embed.Fields.1",
						textChannel.guild.preferredLocale,
					),
					value: this.translate.getTranslation(
						"Events.PlayerEvents.trackError.Embed.Fields.Content.1",
						textChannel.guild.preferredLocale,
						{
							PAYLOAD: JSON.stringify(payload),
						},
					),
				},
			])
			.setThumbnail(track.info.artworkUrl)
			.setFooter({
				text: this.translate.getTranslation(
					"Events.PlayerEvents.trackError.Embed.Footer",
					textChannel.guild.preferredLocale,
				),
			})
			.setTimestamp();
	}

	public async TrackStuck(textChannel: TextChannel, track: Track): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: this.client.user.tag,
				url: this.client.user.displayAvatarURL(),
			})
			.setColor("#00c26f")
			.setTitle(
				this.translate.getTranslation("Events.PlayerEvents.trackStuck.Embed.Title", textChannel.guild.preferredLocale, {
					EMOJI: this.config.getOrThrow<Config["Emojis"]>("Emojis").fail,
				}),
			)
			.setDescription(
				this.translate.getTranslation(
					"Events.PlayerEvents.trackStuck.Embed.Description",
					textChannel.guild.preferredLocale,
					{
						TITLE: track.info.title,
						URI: track.info.uri,
					},
				),
			)
			.setThumbnail(track.info.artworkUrl)
			.setFooter({
				text: this.translate.getTranslation(
					"Events.PlayerEvents.trackStuck.Embed.Footer",
					textChannel.guild.preferredLocale,
				),
			})
			.setTimestamp();
	}
}
