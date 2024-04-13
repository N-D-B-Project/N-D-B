import { Config } from "@/modules/shared/config/types";
import { Timer } from "@/utils/Tools";
import { LOCALIZATION_ADAPTER, NestedLocalizationAdapter } from "@necord/localization";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
	Client,
	ColorResolvable,
	EmbedBuilder,
	Guild,
	TextChannel,
	User,
	VoiceChannel,
	channelMention,
} from "discord.js";
import { Player, SearchResult, Track, TrackExceptionEvent } from "lavalink-client";
import { Context } from "../commands/Commands.context";
import type { IMusicEmbeds } from "./interfaces";

@Injectable()
export class MusicEmbeds implements IMusicEmbeds {
	public constructor(
		@Inject(LOCALIZATION_ADAPTER) private readonly translate: NestedLocalizationAdapter,
		private readonly config: ConfigService<Config>,
		private readonly client: Client,
	) {}

	private async createBaseEmbed(context: Context, color: "Error" | "Success"): Promise<EmbedBuilder> {
		const hex = color === "Error" ? "#c20e00" : "#00c26f";

		return new EmbedBuilder()
			.setAuthor({
				name: context.author.username,
				iconURL: context.author.displayAvatarURL(),
			})
			.setTimestamp()
			.setColor(hex as ColorResolvable);
	}

	public async NoPlayer(context: Context): Promise<EmbedBuilder> {
		const baseEmbed = await this.createBaseEmbed(context, "Error");
		return baseEmbed
			.setTitle(this.translate.getTranslation("Tools/Music:NoPlayerEmbed:Title", context.guild.preferredLocale))
			.addFields([
				{
					name: this.translate.getTranslation("Tools/Music:NoPlayerEmbed:Fields:1", context.guild.preferredLocale),
					value: this.translate.getTranslation(
						"Tools/Music:NoPlayerEmbed:Fields:Content:1",
						context.guild.preferredLocale,
						{
							GuildName: context.guild.name,
						},
					),
				},
			]);
	}

	public async NoChannel(context: Context): Promise<EmbedBuilder> {
		const baseEmbed = await this.createBaseEmbed(context, "Error");
		return baseEmbed
			.setTitle(this.translate.getTranslation("Tools/Music:NoChannelEmbed:Title", context.guild.preferredLocale))
			.setDescription(
				this.translate.getTranslation("Tools/Music:NoChannelEmbed:Description", context.guild.preferredLocale),
			)
			.setFooter({
				text: this.translate.getTranslation("Tools/Music:NoChannelEmbed:Footer", context.guild.preferredLocale),
				iconURL: this.client.user.displayAvatarURL(),
			});
	}

	public async NoArgs(context: Context): Promise<EmbedBuilder> {
		const baseEmbed = await this.createBaseEmbed(context, "Error");
		return baseEmbed
			.setTitle(this.translate.getTranslation("Tools/Music:NoArgsEmbed:Title", context.guild.preferredLocale))
			.setDescription(
				this.translate.getTranslation("Tools/Music:NoArgsEmbed:Description", context.guild.preferredLocale),
			)
			.setFooter({
				text: this.translate.getTranslation("Tools/Music:NoArgsEmbed:Footer", context.guild.preferredLocale),
				iconURL: this.client.user.displayAvatarURL(),
			});
	}

	public async LoadType(
		context: Context,
		loadType: "Fail" | "NoMatches" | "Success",
		Checker: {
			Emoji: string;
			Name: string;
		},
		track?: Track,
	): Promise<EmbedBuilder> {
		const baseEmbed = await this.createBaseEmbed(context, "Error");
		switch (loadType) {
			case "Fail":
				baseEmbed
					.setTitle(
						this.translate.getTranslation(
							"Tools/Music:loadType:LOAD_FAILED:Embed:Title",
							context.guild.preferredLocale,
						),
					)
					.setDescription(
						this.translate.getTranslation(
							"Tools/Music:loadType:LOAD_FAILED:Embed:Description",
							context.guild.preferredLocale,
						),
					)
					.setFooter({
						text: this.translate.getTranslation(
							"Tools/Music:loadType:LOAD_FAILED:Embed:Footer",
							context.guild.preferredLocale,
						),
						iconURL: this.client.user.displayAvatarURL(),
					});

				break;
			case "NoMatches":
				baseEmbed
					.setTitle(
						this.translate.getTranslation("Tools/Music:loadType:NO_MATCHES:Embed:Title", context.guild.preferredLocale),
					)
					.setDescription(
						this.translate.getTranslation(
							"Tools/Music:loadType:NO_MATCHES:Embed:Description",
							context.guild.preferredLocale,
						),
					)
					.setFooter({
						text: this.translate.getTranslation(
							"Tools/Music:loadType:NO_MATCHES:Embed:Footer",
							context.guild.preferredLocale,
						),
						iconURL: this.client.user.displayAvatarURL(),
					});

				break;
			case "Success":
				baseEmbed
					.setColor("#00c26f")
					.setTitle(
						this.translate.getTranslation("Tools/Music:loadType:SUCCESS:Embed:Title", context.guild.preferredLocale),
					)
					.addFields([
						{
							name: this.translate.getTranslation(
								"Tools/Music:loadType:SUCCESS:Embed:Fields:1",
								context.guild.preferredLocale,
								{
									EMOJI: Checker.Emoji,
									NAME: Checker.Name,
								},
							),
							value: this.translate.getTranslation(
								"Tools/Music:loadType:SUCCESS:Embed:Fields:Content:1",
								context.guild.preferredLocale,
								{
									TITLE: track.info.title,
									URI: track.info.uri,
								},
							),
							inline: true,
						},
						{
							name: this.translate.getTranslation(
								"Tools/Music:loadType:SUCCESS:Embed:Fields:2",
								context.guild.preferredLocale,
							),
							value: this.translate.getTranslation(
								"Tools/Music:loadType:SUCCESS:Embed:Fields:Content:2",
								context.guild.preferredLocale,
								{
									AUTHOR: track.info.author,
								},
							),
							inline: true,
						},
						{
							name: this.translate.getTranslation(
								"Tools/Music:loadType:SUCCESS:Embed:Fields:3",
								context.guild.preferredLocale,
							),
							value: this.translate.getTranslation(
								"Tools/Music:loadType:SUCCESS:Embed:Fields:Content:3",
								context.guild.preferredLocale,
								{
									TIMER: await Timer(this.translate, "normal", track.info.duration, context.guild.preferredLocale),
								},
							),
							inline: true,
						},
					])
					.setThumbnail(track.info.artworkUrl)
					.setFooter({
						text: this.translate.getTranslation(
							"Tools/Music:loadType:SUCCESS:Embed:Footer",
							context.guild.preferredLocale,
						),
						iconURL: this.client.user.displayAvatarURL(),
					});

				break;
		}

		return baseEmbed;
	}

	public async Playlist(
		context: Context,
		res: SearchResult,
		Checker: {
			Emoji: string;
			Name: string;
		},
	): Promise<EmbedBuilder> {
		const baseEmbed = await this.createBaseEmbed(context, "Success");
		return baseEmbed
			.setTitle(
				this.translate.getTranslation(
					"Tools/Music:loadType:SUCCESS:Embed:PlaylistTitle",
					context.guild.preferredLocale,
					{
						Quantity: String(res.tracks.length),
					},
				),
			)
			.setThumbnail(res.playlist.thumbnail)
			.addFields([
				{
					name: this.translate.getTranslation(
						"Tools/Music:loadType:SUCCESS:Embed:Fields:1",
						context.guild.preferredLocale,
						{
							EMOJI: Checker.Emoji,
							NAME: Checker.Name,
						},
					),
					value: this.translate.getTranslation(
						"Tools/Music:loadType:SUCCESS:Embed:Fields:Content:1",
						context.guild.preferredLocale,
						{
							TITLE: res.playlist.name ?? res.playlist.title,
							URI: res.playlist.uri,
						},
					),
					inline: true,
				},
				{
					name: this.translate.getTranslation(
						"Tools/Music:loadType:SUCCESS:Embed:Fields:2",
						context.guild.preferredLocale,
					),
					value: this.translate.getTranslation(
						"Tools/Music:loadType:SUCCESS:Embed:Fields:Content:2",
						context.guild.preferredLocale,
						{
							AUTHOR: res.playlist.author,
						},
					),
					inline: true,
				},
				{
					name: this.translate.getTranslation(
						"Tools/Music:loadType:SUCCESS:Embed:Fields:3",
						context.guild.preferredLocale,
					),
					value: this.translate.getTranslation(
						"Tools/Music:loadType:SUCCESS:Embed:Fields:Content:3",
						context.guild.preferredLocale,
						{
							TIMER: await Timer(this.translate, "normal", res.playlist.duration, context.guild.preferredLocale),
						},
					),
					inline: true,
				},
			])
			.setFooter({
				text: this.translate.getTranslation("Tools/Music:loadType:SUCCESS:Embed:Footer", context.guild.preferredLocale),
				iconURL: this.client.user.displayAvatarURL(),
			});
	}

	public async NowPlaying(context: Context, player: Player, progressBar: string): Promise<EmbedBuilder> {
		const baseEmbed = await this.createBaseEmbed(context, "Success");
		const music = player.queue.current;
		let IsLoop: string;
		switch (player.repeatMode) {
			case "off":
				IsLoop = this.translate.getTranslation("Tools/Music:NowPlayingEmbed:NoLoop", context.guild.preferredLocale, {
					Emoji: this.config.getOrThrow<Config["Emojis"]>("Emojis").fail,
				});
				break;
			case "queue":
				IsLoop = await this.translate.getTranslation(
					"Tools/Music:NowPlayingEmbed:QueueLoop",
					context.guild.preferredLocale,
					{
						Emoji: this.config.getOrThrow<Config["Emojis"]>("Emojis").success,
					},
				);
				break;
			case "track":
				IsLoop = await this.translate.getTranslation(
					"Tools/Music:NowPlayingEmbed:MusicLoop",
					context.guild.preferredLocale,
					{
						Emoji: this.config.getOrThrow<Config["Emojis"]>("Emojis").success,
					},
				);
				break;
		}

		return baseEmbed
			.setThumbnail(music.info.artworkUrl)
			.setTitle(await this.translate.getTranslation("Tools/Music:NowPlayingEmbed:Title", context.guild.preferredLocale))
			.setDescription(`[${music.info.title}](${music.info.uri})`)
			.setFields([
				{
					name: await this.translate.getTranslation(
						"Tools/Music:NowPlayingEmbed:Fields:1",
						context.guild.preferredLocale,
					),
					value: await this.translate.getTranslation(
						"Tools/Music:NowPlayingEmbed:Fields:Content:1",
						context.guild.preferredLocale,
						{
							Author: music.info.author,
						},
					),
					inline: true,
				},
				{
					name: await this.translate.getTranslation(
						"Tools/Music:NowPlayingEmbed:Fields:2",
						context.guild.preferredLocale,
					),
					value: await this.translate.getTranslation(
						"Tools/Music:NowPlayingEmbed:Fields:Content:2",
						context.guild.preferredLocale,
						{
							IsPlaying: player.paused
								? await this.translate.getTranslation(
										"Tools/Music:NowPlayingEmbed:Paused",
										context.guild.preferredLocale,
										{
											Emoji: this.config.getOrThrow<Config["Emojis"]>("Emojis").fail,
										},
									)
								: await this.translate.getTranslation(
										"Tools/Music:NowPlayingEmbed:Playing",
										context.guild.preferredLocale,
										{
											Emoji: this.config.getOrThrow<Config["Emojis"]>("Emojis").success,
										},
									),
						},
					),
					inline: true,
				},
				{
					name: await this.translate.getTranslation(
						"Tools/Music:NowPlayingEmbed:Fields:3",
						context.guild.preferredLocale,
					),
					value: await this.translate.getTranslation(
						"Tools/Music:NowPlayingEmbed:Fields:Content:3",
						context.guild.preferredLocale,
						{
							IsBassBoosted: player.filterManager.equalizerBands
								? await this.translate.getTranslation(
										"Tools/Music:NowPlayingEmbed:ActiveBass",
										context.guild.preferredLocale,
										{
											Emoji: this.config.getOrThrow<Config["Emojis"]>("Emojis").success,
										},
									)
								: await this.translate.getTranslation(
										"Tools/Music:NowPlayingEmbed:NoBass",
										context.guild.preferredLocale,
										{
											Emoji: this.config.getOrThrow<Config["Emojis"]>("Emojis").fail,
										},
									),
						},
					),
					inline: true,
				},
				{
					name: await this.translate.getTranslation(
						"Tools/Music:NowPlayingEmbed:Fields:4",
						context.guild.preferredLocale,
					),
					value: await this.translate.getTranslation(
						"Tools/Music:NowPlayingEmbed:Fields:Content:4",
						context.guild.preferredLocale,
						{
							IsLoop,
						},
					),
					inline: true,
				},
				{
					name: await this.translate.getTranslation(
						"Tools/Music:NowPlayingEmbed:Fields:5",
						context.guild.preferredLocale,
					),
					value: await this.translate.getTranslation(
						"Tools/Music:NowPlayingEmbed:Fields:Content:5",
						context.guild.preferredLocale,
						{
							Volume: String(player.volume),
						},
					),
					inline: true,
				},
				{
					name: await this.translate.getTranslation(
						"Tools/Music:NowPlayingEmbed:Fields:6",
						context.guild.preferredLocale,
					),
					value: await this.translate.getTranslation(
						"Tools/Music:NowPlayingEmbed:Fields:Content:6",
						context.guild.preferredLocale,
						{
							Duration: progressBar,
						},
					),
					inline: false,
				},
			])
			.setFooter({
				text: context.guild.name,
				iconURL: context.guild.iconURL(),
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
			.setTitle(
				await this.translate.getTranslation("Events/PlayerEvents:playerCreate:Embed:Title", guild.preferredLocale),
			)
			.setFields([
				{
					name: await this.translate.getTranslation(
						"Events/PlayerEvents:playerCreate:Embed:Fields:1",
						guild.preferredLocale,
					),
					value: await this.translate.getTranslation(
						"Events/PlayerEvents:playerCreate:Embed:Fields:Content:1",
						guild.preferredLocale,
						{
							TEXT: channelMention(textChannel.id),
						},
					),
					inline: true,
				},
				{
					name: await this.translate.getTranslation(
						"Events/PlayerEvents:playerCreate:Embed:Fields:2",
						guild.preferredLocale,
					),
					value: await this.translate.getTranslation(
						"Events/PlayerEvents:playerCreate:Embed:Fields:Content:2",
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
					name: await this.translate.getTranslation(
						"Events/PlayerEvents:playerCreate:Embed:Fields:3",
						guild.preferredLocale,
					),
					value: await this.translate.getTranslation(
						"Events/PlayerEvents:playerCreate:Embed:Fields:Content:3",
						guild.preferredLocale,
						{
							VOICE: channelMention(voiceChannel.id),
						},
					),
				},
			])
			.setFooter({
				text: await this.translate.getTranslation(
					"Events/PlayerEvents:playerCreate:Embed:Footer",
					guild.preferredLocale,
				),
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
				await this.translate.getTranslation(
					"Events/PlayerEvents:playerMove:KickEmbed:Title",
					textChannel.guild.preferredLocale,
				),
			)
			.setDescription(
				await this.translate.getTranslation(
					"Events/PlayerEvents:playerMove:KickEmbed:Description",
					textChannel.guild.preferredLocale,
					{
						CHANNEL: voiceChannel.name,
					},
				),
			)
			.setFooter({
				text: await this.translate.getTranslation(
					"Events/PlayerEvents:playerMove:KickEmbed:Footer",
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
				await this.translate.getTranslation(
					"Events/PlayerEvents:trackStart:Embed:Title",
					textChannel.guild.preferredLocale,
					{
						TITLE: track.info.title,
					},
				),
			)
			.setThumbnail(track.info.artworkUrl)
			.addFields([
				{
					name: await this.translate.getTranslation(
						"Events/PlayerEvents:trackStart:Embed:Fields:1",
						textChannel.guild.preferredLocale,
						{
							EMOJI: Checker.Emoji,
							Platform,
						},
					),
					value: `> ${await this.translate.getTranslation(
						"Events/PlayerEvents:trackStart:Embed:Fields:Content:1",
						textChannel.guild.preferredLocale,
						{
							URI: track.info.uri,
						},
					)}`,
					inline: true,
				},
				{
					name: await this.translate.getTranslation(
						"Events/PlayerEvents:trackStart:Embed:Fields:2",
						textChannel.guild.preferredLocale,
					),
					value: `> ${await this.translate.getTranslation(
						"Events/PlayerEvents:trackStart:Embed:Fields:Content:2",
						textChannel.guild.preferredLocale,
						{
							AUTHOR: track.info.author,
						},
					)}`,
					inline: true,
				},
				{
					name: await this.translate.getTranslation(
						"Events/PlayerEvents:trackStart:Embed:Fields:3",
						textChannel.guild.preferredLocale,
					),
					value: `> ${
						track.info.isStream
							? await this.translate.getTranslation(
									"Events/PlayerEvents:trackStart:Embed:Fields:Content:3²",
									textChannel.guild.preferredLocale,
								)
							: await this.translate.getTranslation(
									"Events/PlayerEvents:trackStart:Embed:Fields:Content:3",
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
				text: await this.translate.getTranslation(
					"Events/PlayerEvents:trackStart:Embed:Footer",
					textChannel.guild.preferredLocale,
					{
						REQUESTER: Requester.username,
					},
				),
				iconURL: Requester.displayAvatarURL(),
			})
			.setTimestamp();
	}

	public async TrackError(textChannel: TextChannel, track: Track, payload: TrackExceptionEvent): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: this.client.user.tag,
				url: this.client.user.displayAvatarURL(),
			})
			.setColor("#00c26f")
			.setTitle(
				await this.translate.getTranslation(
					"Events/PlayerEvents:trackError:Embed:Title",
					textChannel.guild.preferredLocale,
				),
			)
			.setDescription(
				await this.translate.getTranslation(
					"Events/PlayerEvents:trackError:Embed:Description",
					textChannel.guild.preferredLocale,
					{
						TITLE: track.info.title,
						URI: track.info.uri,
					},
				),
			)
			.addFields([
				{
					name: await this.translate.getTranslation(
						"Events/PlayerEvents:trackError:Embed:Fields:1",
						textChannel.guild.preferredLocale,
					),
					value: await this.translate.getTranslation(
						"Events/PlayerEvents:trackError:Embed:Fields:Content:1",
						textChannel.guild.preferredLocale,
						{
							PAYLOAD: JSON.stringify(payload),
						},
					),
				},
			])
			.setThumbnail(track.info.artworkUrl)
			.setFooter({
				text: await this.translate.getTranslation(
					"Events/PlayerEvents:trackError:Embed:Footer",
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
				await this.translate.getTranslation(
					"Events/PlayerEvents:trackStuck:Embed:Title",
					textChannel.guild.preferredLocale,
					{
						EMOJI: this.config.getOrThrow<Config["Emojis"]>("Emojis").fail,
					},
				),
			)
			.setDescription(
				await this.translate.getTranslation(
					"Events/PlayerEvents:trackStuck:Embed:Description",
					textChannel.guild.preferredLocale,
					{
						TITLE: track.info.title,
						URI: track.info.uri,
					},
				),
			)
			.setThumbnail(track.info.artworkUrl)
			.setFooter({
				text: await this.translate.getTranslation(
					"Events/PlayerEvents:trackStuck:Embed:Footer",
					textChannel.guild.preferredLocale,
				),
			})
			.setTimestamp();
	}
}
