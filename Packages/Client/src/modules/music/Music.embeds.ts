import { Config } from "@/modules/config/types";
import type { Ii18nService } from "@/modules/i18n/interfaces/Ii18nService";
import { Extends } from "@/types/Constants";
import { Timer } from "@/utils/Tools";
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
		@Inject(Extends.Translate) private readonly Translate: Ii18nService,
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
		return baseEmbed.setTitle(await this.Translate.Guild(context, "Tools/Music:NoPlayerEmbed:Title")).addFields([
			{
				name: await this.Translate.Guild(context, "Tools/Music:NoPlayerEmbed:Fields:1"),
				value: await this.Translate.Guild(context, "Tools/Music:NoPlayerEmbed:Fields:Content:1", {
					GuildName: context.guild.name,
				}),
			},
		]);
	}

	public async NoChannel(context: Context): Promise<EmbedBuilder> {
		const baseEmbed = await this.createBaseEmbed(context, "Error");
		return baseEmbed
			.setTitle(await this.Translate.Guild(context, "Tools/Music:NoChannelEmbed:Title"))
			.setDescription(await this.Translate.Guild(context, "Tools/Music:NoChannelEmbed:Description"))
			.setFooter({
				text: await this.Translate.Guild(context, "Tools/Music:NoChannelEmbed:Footer"),
				iconURL: this.client.user.displayAvatarURL(),
			});
	}

	public async NoArgs(context: Context): Promise<EmbedBuilder> {
		const baseEmbed = await this.createBaseEmbed(context, "Error");
		return baseEmbed
			.setTitle(await this.Translate.Guild(context, "Tools/Music:NoArgsEmbed:Title"))
			.setDescription(await this.Translate.Guild(context, "Tools/Music:NoArgsEmbed:Description"))
			.setFooter({
				text: await this.Translate.Guild(context, "Tools/Music:NoArgsEmbed:Footer"),
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
					.setTitle(await this.Translate.Guild(context, "Tools/Music:loadType:LOAD_FAILED:Embed:Title"))
					.setDescription(await this.Translate.Guild(context, "Tools/Music:loadType:LOAD_FAILED:Embed:Description"))
					.setFooter({
						text: await this.Translate.Guild(context, "Tools/Music:loadType:LOAD_FAILED:Embed:Footer"),
						iconURL: this.client.user.displayAvatarURL(),
					});

				break;
			case "NoMatches":
				baseEmbed
					.setTitle(await this.Translate.Guild(context, "Tools/Music:loadType:NO_MATCHES:Embed:Title"))
					.setDescription(await this.Translate.Guild(context, "Tools/Music:loadType:NO_MATCHES:Embed:Description"))
					.setFooter({
						text: await this.Translate.Guild(context, "Tools/Music:loadType:NO_MATCHES:Embed:Footer"),
						iconURL: this.client.user.displayAvatarURL(),
					});

				break;
			case "Success":
				baseEmbed
					.setColor("#00c26f")
					.setTitle(await this.Translate.Guild(context, "Tools/Music:loadType:SUCCESS:Embed:Title"))
					.addFields([
						{
							name: await this.Translate.Guild(context, "Tools/Music:loadType:SUCCESS:Embed:Fields:1", {
								EMOJI: Checker.Emoji,
								NAME: Checker.Name,
							}),
							value: await this.Translate.Guild(context, "Tools/Music:loadType:SUCCESS:Embed:Fields:Content:1", {
								TITLE: track.info.title,
								URI: track.info.uri,
							}),
							inline: true,
						},
						{
							name: await this.Translate.Guild(context, "Tools/Music:loadType:SUCCESS:Embed:Fields:2"),
							value: await this.Translate.Guild(context, "Tools/Music:loadType:SUCCESS:Embed:Fields:Content:2", {
								AUTHOR: track.info.author,
							}),
							inline: true,
						},
						{
							name: await this.Translate.Guild(context, "Tools/Music:loadType:SUCCESS:Embed:Fields:3"),
							value: await this.Translate.Guild(context, "Tools/Music:loadType:SUCCESS:Embed:Fields:Content:3", {
								TIMER: await Timer(this.Translate, "normal", track.info.duration, context),
							}),
							inline: true,
						},
					])
					.setThumbnail(track.info.artworkUrl)
					.setFooter({
						text: await this.Translate.Guild(context, "Tools/Music:loadType:SUCCESS:Embed:Footer"),
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
				await this.Translate.Guild(context, "Tools/Music:loadType:SUCCESS:Embed:PlaylistTitle", {
					Quantity: res.tracks.length,
				}),
			)
			.setThumbnail(res.playlist.thumbnail)
			.addFields([
				{
					name: await this.Translate.Guild(context, "Tools/Music:loadType:SUCCESS:Embed:Fields:1", {
						EMOJI: Checker.Emoji,
						NAME: Checker.Name,
					}),
					value: await this.Translate.Guild(context, "Tools/Music:loadType:SUCCESS:Embed:Fields:Content:1", {
						TITLE: res.playlist.name ?? res.playlist.title,
						URI: res.playlist.uri,
					}),
					inline: true,
				},
				{
					name: await this.Translate.Guild(context, "Tools/Music:loadType:SUCCESS:Embed:Fields:2"),
					value: await this.Translate.Guild(context, "Tools/Music:loadType:SUCCESS:Embed:Fields:Content:2", {
						AUTHOR: res.playlist.author,
					}),
					inline: true,
				},
				{
					name: await this.Translate.Guild(context, "Tools/Music:loadType:SUCCESS:Embed:Fields:3"),
					value: await this.Translate.Guild(context, "Tools/Music:loadType:SUCCESS:Embed:Fields:Content:3", {
						TIMER: await Timer(this.Translate, "normal", res.playlist.duration, context),
					}),
					inline: true,
				},
			])
			.setFooter({
				text: await this.Translate.Guild(context, "Tools/Music:loadType:SUCCESS:Embed:Footer"),
				iconURL: this.client.user.displayAvatarURL(),
			});
	}

	public async NowPlaying(context: Context, player: Player, progressBar: string): Promise<EmbedBuilder> {
		const baseEmbed = await this.createBaseEmbed(context, "Success");
		const music = player.queue.current;
		let IsLoop: string;
		switch (player.repeatMode) {
			case "off":
				IsLoop = await this.Translate.Guild(context, "Tools/Music:NowPlayingEmbed:NoLoop", {
					Emoji: this.config.getOrThrow<Config["Emojis"]>("Emojis").fail,
				});
				break;
			case "queue":
				IsLoop = await this.Translate.Guild(context, "Tools/Music:NowPlayingEmbed:QueueLoop", {
					Emoji: this.config.getOrThrow<Config["Emojis"]>("Emojis").success,
				});
				break;
			case "track":
				IsLoop = await this.Translate.Guild(context, "Tools/Music:NowPlayingEmbed:MusicLoop", {
					Emoji: this.config.getOrThrow<Config["Emojis"]>("Emojis").success,
				});
				break;
		}

		return baseEmbed
			.setThumbnail(music.info.artworkUrl)
			.setTitle(await this.Translate.Guild(context, "Tools/Music:NowPlayingEmbed:Title"))
			.setDescription(`[${music.info.title}](${music.info.uri})`)
			.setFields([
				{
					name: await this.Translate.Guild(context, "Tools/Music:NowPlayingEmbed:Fields:1"),
					value: await this.Translate.Guild(context, "Tools/Music:NowPlayingEmbed:Fields:Content:1", {
						Author: music.info.author,
					}),
					inline: true,
				},
				{
					name: await this.Translate.Guild(context, "Tools/Music:NowPlayingEmbed:Fields:2"),
					value: await this.Translate.Guild(context, "Tools/Music:NowPlayingEmbed:Fields:Content:2", {
						IsPlaying: player.paused
							? await this.Translate.Guild(context, "Tools/Music:NowPlayingEmbed:Paused", {
									Emoji: this.config.getOrThrow<Config["Emojis"]>("Emojis").fail,
							  })
							: await this.Translate.Guild(context, "Tools/Music:NowPlayingEmbed:Playing", {
									Emoji: this.config.getOrThrow<Config["Emojis"]>("Emojis").success,
							  }),
					}),
					inline: true,
				},
				{
					name: await this.Translate.Guild(context, "Tools/Music:NowPlayingEmbed:Fields:3"),
					value: await this.Translate.Guild(context, "Tools/Music:NowPlayingEmbed:Fields:Content:3", {
						IsBassBoosted: player.filterManager.equalizerBands
							? await this.Translate.Guild(context, "Tools/Music:NowPlayingEmbed:ActiveBass", {
									Emoji: this.config.getOrThrow<Config["Emojis"]>("Emojis").success,
							  })
							: await this.Translate.Guild(context, "Tools/Music:NowPlayingEmbed:NoBass", {
									Emoji: this.config.getOrThrow<Config["Emojis"]>("Emojis").fail,
							  }),
					}),
					inline: true,
				},
				{
					name: await this.Translate.Guild(context, "Tools/Music:NowPlayingEmbed:Fields:4"),
					value: await this.Translate.Guild(context, "Tools/Music:NowPlayingEmbed:Fields:Content:4", {
						IsLoop,
					}),
					inline: true,
				},
				{
					name: await this.Translate.Guild(context, "Tools/Music:NowPlayingEmbed:Fields:5"),
					value: await this.Translate.Guild(context, "Tools/Music:NowPlayingEmbed:Fields:Content:5", {
						Volume: player.volume,
					}),
					inline: true,
				},
				{
					name: await this.Translate.Guild(context, "Tools/Music:NowPlayingEmbed:Fields:6"),
					value: await this.Translate.Guild(context, "Tools/Music:NowPlayingEmbed:Fields:Content:6", {
						Duration: progressBar,
					}),
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
			.setTitle(await this.Translate.Guild(textChannel, "Events/PlayerEvents:playerCreate:Embed:Title"))
			.setFields([
				{
					name: await this.Translate.Guild(textChannel, "Events/PlayerEvents:playerCreate:Embed:Fields:1"),
					value: await this.Translate.Guild(textChannel, "Events/PlayerEvents:playerCreate:Embed:Fields:Content:1", {
						TEXT: channelMention(textChannel.id),
					}),
					inline: true,
				},
				{
					name: await this.Translate.Guild(textChannel, "Events/PlayerEvents:playerCreate:Embed:Fields:2"),
					value: await this.Translate.Guild(textChannel, "Events/PlayerEvents:playerCreate:Embed:Fields:Content:2", {
						isPremium: player.isPremium
							? this.config.getOrThrow<Config["Emojis"]>("Emojis").accept
							: this.config.getOrThrow<Config["Emojis"]>("Emojis").fail,
					}),
					inline: true,
				},
				{
					name: await this.Translate.Guild(textChannel, "Events/PlayerEvents:playerCreate:Embed:Fields:3"),
					value: await this.Translate.Guild(textChannel, "Events/PlayerEvents:playerCreate:Embed:Fields:Content:3", {
						VOICE: channelMention(voiceChannel.id),
					}),
				},
			])
			.setFooter({
				text: await this.Translate.Guild(textChannel, "Events/PlayerEvents:playerCreate:Embed:Footer"),
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
			.setTitle(await this.Translate.Guild(textChannel, "Events/PlayerEvents:playerMove:KickEmbed:Title"))
			.setDescription(
				await this.Translate.Guild(textChannel, "Events/PlayerEvents:playerMove:KickEmbed:Description", {
					CHANNEL: voiceChannel.name,
				}),
			)
			.setFooter({
				text: await this.Translate.Guild(textChannel, "Events/PlayerEvents:playerMove:KickEmbed:Footer"),
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
				await this.Translate.Guild(textChannel, "Events/PlayerEvents:trackStart:Embed:Title", {
					TITLE: track.info.title,
				}),
			)
			.setThumbnail(track.info.artworkUrl)
			.addFields([
				{
					name: await this.Translate.Guild(textChannel, "Events/PlayerEvents:trackStart:Embed:Fields:1", {
						EMOJI: Checker.Emoji,
						Platform,
					}),
					value: `> ${await this.Translate.Guild(textChannel, "Events/PlayerEvents:trackStart:Embed:Fields:Content:1", {
						URI: track.info.uri,
					})}`,
					inline: true,
				},
				{
					name: await this.Translate.Guild(textChannel, "Events/PlayerEvents:trackStart:Embed:Fields:2"),
					value: `> ${await this.Translate.Guild(textChannel, "Events/PlayerEvents:trackStart:Embed:Fields:Content:2", {
						AUTHOR: track.info.author,
					})}`,
					inline: true,
				},
				{
					name: await this.Translate.Guild(textChannel, "Events/PlayerEvents:trackStart:Embed:Fields:3"),
					value: `> ${
						track.info.isStream
							? await this.Translate.Guild(textChannel, "Events/PlayerEvents:trackStart:Embed:Fields:Content:3²")
							: await this.Translate.Guild(textChannel, "Events/PlayerEvents:trackStart:Embed:Fields:Content:3", {
									TIMER: Timer,
							  })
					}`,
					inline: true,
				},
			])
			.setColor("#00c26f")
			.setFooter({
				text: await this.Translate.Guild(textChannel, "Events/PlayerEvents:trackStart:Embed:Footer", {
					REQUESTER: Requester.username,
				}),
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
			.setTitle(await this.Translate.Guild(textChannel, "Events/PlayerEvents:trackError:Embed:Title"))
			.setDescription(
				await this.Translate.Guild(textChannel, "Events/PlayerEvents:trackError:Embed:Description", {
					TITLE: track.info.title,
					URI: track.info.uri,
				}),
			)
			.addFields([
				{
					name: await this.Translate.Guild(textChannel, "Events/PlayerEvents:trackError:Embed:Fields:1"),
					value: await this.Translate.Guild(textChannel, "Events/PlayerEvents:trackError:Embed:Fields:Content:1", {
						PAYLOAD: payload,
					}),
				},
			])
			.setThumbnail(track.info.artworkUrl)
			.setFooter({
				text: await this.Translate.Guild(textChannel, "Events/PlayerEvents:trackError:Embed:Footer"),
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
				await this.Translate.Guild(textChannel, "Events/PlayerEvents:trackStuck:Embed:Title", {
					EMOJI: this.config.getOrThrow<Config["Emojis"]>("Emojis").fail,
				}),
			)
			.setDescription(
				await this.Translate.Guild(textChannel, "Events/PlayerEvents:trackStuck:Embed:Description", {
					TITLE: track.info.title,
					URI: track.info.uri,
				}),
			)
			.setThumbnail(track.info.artworkUrl)
			.setFooter({
				text: await this.Translate.Guild(textChannel, "Events/PlayerEvents:trackStuck:Embed:Footer"),
			})
			.setTimestamp();
	}
}
