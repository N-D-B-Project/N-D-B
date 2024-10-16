import {
	LOCALIZATION_ADAPTER,
	// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
	// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
	NestedLocalizationAdapter,
} from "@necord/localization";
import { Inject, Injectable } from "@nestjs/common";
import {
	// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
	Client,
	EmbedBuilder,
	type Guild,
	type VoiceChannel,
	channelMention,
} from "discord.js";
import type { IMusicEmbeds } from "./interfaces";

@Injectable()
export class MusicEmbeds implements IMusicEmbeds {
	public constructor(
		@Inject(LOCALIZATION_ADAPTER)
		private readonly translate: NestedLocalizationAdapter,
		private readonly client: Client,
	) {}

	public async PlayerCreateEmbed(
		guild: Guild,
		textChannelId: string,
		voiceChannelId: string,
	): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: guild.name,
				iconURL: guild.iconURL(),
			})
			.setColor("#00c26f")
			.setTitle(
				this.translate.getTranslation(
					"Events.PlayerEvents.playerCreate.Embed.Title",
					guild.preferredLocale,
				),
			)
			.setFields([
				{
					name: this.translate.getTranslation(
						"Events.PlayerEvents.playerCreate.Embed.Fields.1",
						guild.preferredLocale,
					),
					value: this.translate.getTranslation(
						"Events.PlayerEvents.playerCreate.Embed.Fields.Content.1",
						guild.preferredLocale,
						{ TEXT: channelMention(textChannelId) },
					),
					inline: true,
				},
				{
					name: this.translate.getTranslation(
						"Events.PlayerEvents.playerCreate.Embed.Fields.3",
						guild.preferredLocale,
					),
					value: this.translate.getTranslation(
						"Events.PlayerEvents.playerCreate.Embed.Fields.Content.3",
						guild.preferredLocale,
						{ VOICE: channelMention(voiceChannelId) },
					),
				},
			])
			.setFooter({
				text: this.translate.getTranslation(
					"Events.PlayerEvents.playerCreate.Embed.Footer",
					guild.preferredLocale,
				),
				iconURL: this.client.user.displayAvatarURL(),
			})
			.setTimestamp();
	}

	public async PlayerMoveKickEmbed(
		guildLocale: string,
		voiceChannelId: string,
	): Promise<EmbedBuilder> {
		const voiceChannel = (await this.client.channels.fetch(
			voiceChannelId,
		)) as VoiceChannel;
		return new EmbedBuilder()
			.setAuthor({
				name: this.client.user.tag,
				url: this.client.user.displayAvatarURL(),
			})
			.setColor("#00c26f")
			.setTitle(
				this.translate.getTranslation(
					"Events/PlayerEvents:playerMove:KickEmbed:Title",
					guildLocale,
				),
			)
			.setDescription(
				this.translate.getTranslation(
					"Events/PlayerEvents:playerMove:KickEmbed:Description",
					guildLocale,
					{ CHANNEL: voiceChannel.name },
				),
			)
			.setFooter({
				text: this.translate.getTranslation(
					"Events/PlayerEvents:playerMove:KickEmbed:Footer",
					guildLocale,
				),
			})
			.setTimestamp();
	}

	public async QueueEndAutoLeaveEmbed(
		guildLocale: string,
		voiceChannelId: string,
		timer: string,
	): Promise<EmbedBuilder> {
		const voiceChannel = (await this.client.channels.fetch(
			voiceChannelId,
		)) as VoiceChannel;
		return new EmbedBuilder()
			.setAuthor({
				name: this.client.user.tag,
				url: this.client.user.displayAvatarURL(),
			})
			.setColor("#00c26f")
			.setTitle(
				this.translate.getTranslation(
					"Events.PlayerEvents.playerMove.queueEnd.Title",
					guildLocale,
				),
			)
			.setDescription(
				this.translate.getTranslation(
					"Events.PlayerEvents.playerMove.queueEnd.Description",
					guildLocale,
					{ CHANNEL: voiceChannel.name, Timer: timer },
				),
			)
			.setFooter({
				text: this.translate.getTranslation(
					"Events.PlayerEvents.playerMove.queueEnd.Footer",
					guildLocale,
					{ TIMER: timer },
				),
			})
			.setTimestamp();
	}
}
