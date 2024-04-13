import { CommandConfig, CommandPermissions, LegacyCommand, SlashCommand } from "@/common/decorators";
import type { INDBService } from "@/modules/bot/core/interfaces/INDBService";
import { Services } from "@/types/Constants";
import { Timer } from "@/utils/Tools";
import { LOCALIZATION_ADAPTER, NestedLocalizationAdapter } from "@necord/localization";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { EmbedBuilder, Message, UserManager } from "discord.js";
import { Track, UnresolvedTrack } from "lavalink-client";
import { Music } from "..";
import { CommandContext } from "../../commands/Commands.context";
import type { IMusicService } from "../interfaces";

@Injectable()
export class QueueCommand {
	public constructor(
		@Inject(Services.NDB) private readonly NDBService: INDBService,
		@Inject(Music.Service) private readonly service: IMusicService,
		@Inject(LOCALIZATION_ADAPTER) private readonly translate: NestedLocalizationAdapter,
		private readonly users: UserManager,
	) {}

	private readonly logger = new Logger(QueueCommand.name);

	@LegacyCommand({
		name: "Queue",
		aliases: ["queue"],
		description: "Shows the music Queue",
		usage: "",
	})
	@SlashCommand({
		name: "queue",
		type: "Sub",
		deployMode: "Test",
	})
	@CommandConfig({ category: "🎵 Music" })
	@CommandPermissions({
		bot: ["Connect", "EmbedLinks", "DeafenMembers", "Speak"],
		user: ["Connect", "SendMessages"],
		guildOnly: false,
		ownerOnly: false,
	})
	public async onCommandRun([client, context]: CommandContext): Promise<Message> {
		if (!(await this.service.checkers(context))) {
			return;
		}

		const player = await this.service.getPlayer(context);

		const embeds: Array<EmbedBuilder> = [];
		const queue: Array<Track | UnresolvedTrack> = player.queue.tracks;

		for (const track of queue) {
			const Requester = await this.users.fetch(track.requester as string);

			embeds.push(
				new EmbedBuilder()
					.setAuthor({
						name: client.user.username,
						iconURL: client.user.displayAvatarURL(),
					})
					.setTitle(
						this.translate.getTranslation("Events/PlayerEvents:trackStart:Embed:Title", context.guild.preferredLocale, {
							TITLE: track.info.title,
						}),
					)
					.setThumbnail(track.info.artworkUrl)
					.addFields([
						{
							name: this.translate.getTranslation(
								"Events/PlayerEvents:trackStart:Embed:Fields:1",
								context.guild.preferredLocale,
								{
									EMOJI: (await this.service.URLChecker(false, track.info.uri)).Emoji,
								},
							),
							value: `> ${this.translate.getTranslation(
								"Events/PlayerEvents:trackStart:Embed:Fields:Content:1",
								context.guild.preferredLocale,
								{
									Platform: this.service.formatSourceName(track.info.sourceName),
									URI: track.info.uri,
								},
							)}`,
							inline: true,
						},
						{
							name: this.translate.getTranslation(
								"Events/PlayerEvents:trackStart:Embed:Fields:2",
								context.guild.preferredLocale,
							),
							value: `> ${this.translate.getTranslation(
								"Events/PlayerEvents:trackStart:Embed:Fields:Content:2",
								context.guild.preferredLocale,

								{
									AUTHOR: track.info.author,
								},
							)}`,
							inline: true,
						},
						{
							name: this.translate.getTranslation(
								"Events/PlayerEvents:trackStart:Embed:Fields:3",
								context.guild.preferredLocale,
							),
							value: `> ${
								track.info.isStream
									? this.translate.getTranslation(
											"Events/PlayerEvents:trackStart:Embed:Fields:Content:3²",
											context.guild.preferredLocale,
										)
									: this.translate.getTranslation(
											"Events/PlayerEvents:trackStart:Embed:Fields:Content:3",
											context.guild.preferredLocale,
											{
												TIMER: await Timer(
													this.translate,
													"normal",
													track.info.duration,
													context.guild.preferredLocale,
												),
											},
										)
							}`,
							inline: true,
						},
					])
					.setColor("#00c26f")
					.setFooter({
						text: this.translate.getTranslation(
							"Events/PlayerEvents:trackStart:Embed:Footer",
							context.guild.preferredLocale,
							{
								REQUESTER: Requester.username,
							},
						),
						iconURL: Requester.displayAvatarURL(),
					})
					.setTimestamp(),
			);
		}

		await context.reply(await this.NDBService.buildPaginator(context, embeds, `queue-${context.guild.id}`));
	}
}
