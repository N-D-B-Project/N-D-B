import { Timer } from "@/utils/Tools";
import type { TranslationFn } from "@necord/localization";
import { type ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import type { SearchResult, Track } from "lavalink-client";
import { MusicService } from "../../Music.service";

export class PlayEmbeds {
	public constructor(
		private readonly interaction: ChatInputCommandInteraction,
		private readonly translate: TranslationFn,
	) {}

	private async createBaseEmbed(
		color: "Error" | "Success",
	): Promise<EmbedBuilder> {
		const hex = color === "Error" ? "#c20e00" : "#00c26f";

		return new EmbedBuilder()
			.setAuthor({
				name: this.interaction.user.username,
				iconURL: this.interaction.user.displayAvatarURL(),
			})
			.setTimestamp()
			.setColor(hex);
	}

	public async ErrorLoadType(): Promise<EmbedBuilder> {
		return (await this.createBaseEmbed("Error"))
			.setTitle(this.translate("Tools.Music.loadType.LOAD_FAILED.Embed.Title"))
			.setDescription(
				this.translate("Tools.Music.loadType.LOAD_FAILED.Embed.Description"),
			)
			.setFooter({
				text: this.translate("Tools.Music.loadType.LOAD_FAILED.Embed.Footer"),
				iconURL: this.interaction.client.user.displayAvatarURL(),
			});
	}

	public async EmptyLoadType(): Promise<EmbedBuilder> {
		return (await this.createBaseEmbed("Error"))
			.setTitle(this.translate("Tools.Music.loadType.NO_MATCHES.Embed.Title"))
			.setDescription(
				this.translate("Tools.Music.loadType.NO_MATCHES.Embed.Description"),
			)
			.setFooter({
				text: this.translate("Tools.Music.loadType.NO_MATCHES.Embed.Footer"),
				iconURL: this.interaction.client.user.displayAvatarURL(),
			});
	}

	public async TrackSearchLoadType(track: Track): Promise<EmbedBuilder> {
		const timer = await Timer(
			this.translate,
			"normal",
			track.info.duration,
			"",
		);
		const source = await MusicService.getSource(track.info.uri);
		return (await this.createBaseEmbed("Success"))
			.setTitle(this.translate("Tools.Music.loadType.SUCCESS.Embed.Title"))
			.addFields([
				{
					name: this.translate("Tools.Music.loadType.SUCCESS.Embed.Fields.1", {
						EMOJI: source.Emoji,
						NAME: source.Name,
					}),
					value: this.translate(
						"Tools.Music.loadType.SUCCESS.Embed.Fields.Content.1",
						{ TITLE: track.info.title, URI: track.info.uri },
					),
					inline: true,
				},
				{
					name: this.translate("Tools.Music.loadType.SUCCESS.Embed.Fields.2"),
					value: this.translate(
						"Tools.Music.loadType.SUCCESS.Embed.Fields.Content.2",
						{ AUTHOR: track.info.author },
					),
					inline: true,
				},
				{
					name: this.translate("Tools.Music.loadType.SUCCESS.Embed.Fields.3"),
					value: this.translate(
						"Tools.Music.loadType.SUCCESS.Embed.Fields.Content.3",
						{ TIMER: timer },
					),
					inline: true,
				},
			])
			.setThumbnail(track.info.artworkUrl)
			.setFooter({
				text: this.translate("Tools.Music.loadType.SUCCESS.Embed.Footer"),
				iconURL: this.interaction.client.user.displayAvatarURL(),
			});
	}

	public async PlaylistLoadType(res: SearchResult): Promise<EmbedBuilder> {
		const timer = await Timer(
			this.translate,
			"normal",
			res.playlist.duration,
			"",
		);
		const source = await MusicService.getSource(res.playlist.uri);

		return (await this.createBaseEmbed("Success"))
			.setTitle(
				this.translate("Tools.Music.loadType.SUCCESS.Embed.PlaylistTitle", {
					Quantity: res.tracks.length,
				}),
			)
			.setThumbnail(res.playlist.thumbnail)
			.addFields([
				{
					name: this.translate("Tools.Music.loadType.SUCCESS.Embed.Fields.1", {
						EMOJI: source.Emoji,
						NAME: source.Name,
					}),
					value: this.translate(
						"Tools.Music.loadType.SUCCESS.Embed.Fields.Content.1",
						{ TITLE: res.playlist.name, URI: res.playlist.uri },
					),
					inline: true,
				},
				{
					name: this.translate("Tools.Music.loadType.SUCCESS.Embed.Fields.2"),
					value: this.translate(
						"Tools.Music.loadType.SUCCESS.Embed.Fields.Content.2",
						{ AUTHOR: res.playlist.author },
					),
					inline: true,
				},
				{
					name: this.translate("Tools.Music.loadType.SUCCESS.Embed.Fields.3"),
					value: this.translate(
						"Tools.Music.loadType.SUCCESS.Embed.Fields.Content.3",
						{ TIMER: timer },
					),
					inline: true,
				},
			])
			.setFooter({
				text: this.translate("Tools.Music.loadType.SUCCESS.Embed.Footer"),
				iconURL: this.interaction.client.user.displayAvatarURL(),
			});
	}
}
