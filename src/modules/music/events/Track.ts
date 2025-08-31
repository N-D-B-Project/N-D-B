import { MessageTools } from "@/modules/commands/Message";
import type { Config } from "@/modules/config/types";
import { Timer, WAIT } from "@/utils/Tools";
import {
	type LavalinkManagerContextOf,
	// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
	NecordLavalinkService,
	OnLavalinkManager,
} from "@necord/lavalink";
import {
	LOCALIZATION_ADAPTER,
	// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
	NestedLocalizationAdapter,
} from "@necord/localization";
import { Inject, Injectable, Logger } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { ConfigService } from "@nestjs/config";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { Client, EmbedBuilder, type User, UserManager } from "discord.js";
import { Context } from "necord";
import { MusicService } from "../Music.service";
import { PlayerProps } from "../types/constants";

@Injectable()
export class TrackEvents {
	public constructor(
		@Inject(LOCALIZATION_ADAPTER)
		private readonly translate: NestedLocalizationAdapter,
		private readonly lavalinkService: NecordLavalinkService,
		private readonly client: Client,
		private readonly userManager: UserManager,
		private readonly config: ConfigService,
	) {}

	private readonly logger = new Logger(TrackEvents.name);

	@OnLavalinkManager("trackStart")
	public async onTrackStart(
		@Context() [player, track, payload]: LavalinkManagerContextOf<"trackStart">,
	) {
		const { guild, textChannel } =
			await this.lavalinkService.extractPlayerData(player);

		const Requester = await this.userManager.fetch(
			(track.requester as User).id,
		);

		const timer = await Timer(
			this.translate,
			"normal",
			track.info.duration,
			guild.preferredLocale,
		);
		await WAIT(500);

		const embed = new EmbedBuilder()
			.setAuthor({
				name: this.client.user.username,
				iconURL: this.client.user.displayAvatarURL(),
			})
			.setTitle(
				this.translate.getTranslation(
					"Events.PlayerEvents.trackStart.Embed.Title",
					guild.preferredLocale,
					{ TITLE: track.info.title },
				),
			)
			.setThumbnail(track.info.artworkUrl)
			.addFields([
				{
					name: this.translate.getTranslation(
						"Events.PlayerEvents.trackStart.Embed.Fields.1",
						guild.preferredLocale,
						{
							EMOJI: (await MusicService.getSource(track.info.uri)).Emoji,
						},
					),
					value: `> ${this.translate.getTranslation(
						"Events.PlayerEvents.trackStart.Embed.Fields.Content.1",
						guild.preferredLocale,
						{
							Platform: MusicService.formatSourceName(track.info.sourceName),
							URI: track.info.uri,
						},
					)}`,
					inline: true,
				},
				{
					name: this.translate.getTranslation(
						"Events.PlayerEvents.trackStart.Embed.Fields.2",
						guild.preferredLocale,
					),
					value: `> ${this.translate.getTranslation(
						"Events.PlayerEvents.trackStart.Embed.Fields.Content.2",
						guild.preferredLocale,
						{ AUTHOR: track.info.author },
					)}`,
					inline: true,
				},
				{
					name: this.translate.getTranslation(
						"Events.PlayerEvents.trackStart.Embed.Fields.3",
						guild.preferredLocale,
					),
					value: `> ${
						track.info.isStream
							? this.translate.getTranslation(
									"Events.PlayerEvents.trackStart.Embed.Fields.Content.3²",
									guild.preferredLocale,
								)
							: this.translate.getTranslation(
									"Events.PlayerEvents.trackStart.Embed.Fields.Content.3",
									guild.preferredLocale,
									{ TIMER: timer },
								)
					}`,
					inline: true,
				},
			])
			.setColor("#00c26f")
			.setFooter({
				text: this.translate.getTranslation(
					"Events.PlayerEvents.trackStart.Embed.Footer",
					guild.preferredLocale,
					{ REQUESTER: Requester.username },
				),
				iconURL: Requester.displayAvatarURL(),
			})
			.setTimestamp();

		MessageTools.send(textChannel, { embeds: [embed] }).then((msg) => {
			try {
				const CURRENT_SONG_MSG = textChannel.messages.cache.get(
					player.get(PlayerProps.trackMessage),
				);
				if (CURRENT_SONG_MSG && msg.id !== CURRENT_SONG_MSG.id) {
					CURRENT_SONG_MSG.delete().catch((error: Error) => {
						this.logger.warn(
							'Não consegui deletar a "CURRENT_SONG_MSG"',
							error,
						);
					});
				}
			} catch {}
			player.set(PlayerProps.trackMessage, msg.id);
		});
	}

	@OnLavalinkManager("trackEnd")
	public async onTrackEnd(
		@Context() [player, track, payload]: LavalinkManagerContextOf<"trackEnd">,
	) {}

	@OnLavalinkManager("trackError")
	public async onTrackError(
		@Context() [player, track, payload]: LavalinkManagerContextOf<"trackError">,
	) {
		const { guild, textChannel } =
			await this.lavalinkService.extractPlayerData(player);
		const embed = new EmbedBuilder()
			.setAuthor({
				name: this.client.user.tag,
				url: this.client.user.displayAvatarURL(),
			})
			.setColor("#00c26f")
			.setTitle(
				this.translate.getTranslation(
					"Events.PlayerEvents.trackError.Embed.Title",
					guild.preferredLocale,
				),
			)
			.setDescription(
				this.translate.getTranslation(
					"Events.PlayerEvents.trackError.Embed.Description",
					guild.preferredLocale,
					{ TITLE: track.info.title, URI: track.info.uri },
				),
			)
			.addFields([
				{
					name: this.translate.getTranslation(
						"Events.PlayerEvents.trackError.Embed.Fields.1",
						guild.preferredLocale,
					),
					value: this.translate.getTranslation(
						"Events.PlayerEvents.trackError.Embed.Fields.Content.1",
						guild.preferredLocale,
						{ PAYLOAD: payload.op },
					),
				},
			])
			.setThumbnail(track.info.artworkUrl)
			.setFooter({
				text: this.translate.getTranslation(
					"Events.PlayerEvents.trackError.Embed.Footer",
					guild.preferredLocale,
				),
			})
			.setTimestamp();
		MessageTools.send(textChannel, { embeds: [embed] });
	}

	@OnLavalinkManager("trackStuck")
	public async onTrackStuck(
		@Context() [player, track, payload]: LavalinkManagerContextOf<"trackStuck">,
	) {
		const { guild, textChannel } =
			await this.lavalinkService.extractPlayerData(player);
		const embed = new EmbedBuilder()
			.setAuthor({
				name: this.client.user.tag,
				url: this.client.user.displayAvatarURL(),
			})
			.setColor("#00c26f")
			.setTitle(
				this.translate.getTranslation(
					"Events.PlayerEvents.trackStuck.Embed.Title",
					guild.preferredLocale,
					{ EMOJI: this.config.getOrThrow<Config["Emojis"]>("Emojis").fail },
				),
			)
			.setDescription(
				this.translate.getTranslation(
					"Events.PlayerEvents.trackStuck.Embed.Description",
					guild.preferredLocale,
					{ TITLE: track.info.title, URI: track.info.uri },
				),
			)
			.setThumbnail(track.info.artworkUrl)
			.setFooter({
				text: this.translate.getTranslation(
					"Events.PlayerEvents.trackStuck.Embed.Footer",
					guild.preferredLocale,
				),
			})
			.setTimestamp();
		MessageTools.send(textChannel, { embeds: [embed] });
	}
}
