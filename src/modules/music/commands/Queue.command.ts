import { CommandConfig, CommandPermissions } from "@/common/decorators";
import { CommandConfigGuard, CommandPermissionsGuard } from "@/common/guards";
import type { INDBService } from "@/modules/core/interfaces/INDBService";
import { Services } from "@/types/Constants";
import { Timer } from "@/utils/Tools";
import { CurrentTranslate, TranslationFn, localizationMapByKey } from "@necord/localization";
import { Inject, Logger, UseGuards } from "@nestjs/common";
import { Client, EmbedBuilder, Message, UserManager } from "discord.js";
import { Track, UnresolvedTrack } from "lavalink-client";
import { Ctx, SlashCommandContext, Subcommand } from "necord";
import { Music } from "..";
import { MusicCommand } from "../Music.decorator";
import type { IMusicService } from "../interfaces";

@MusicCommand()
export class QueueCommand {
	public constructor(
		@Inject(Services.NDB) private readonly NDBService: INDBService,
		@Inject(Music.Service) private readonly service: IMusicService,
		private readonly client: Client,
		private readonly users: UserManager,
	) {}

	private readonly logger = new Logger(QueueCommand.name);

	@Subcommand({
		name: "queue",
		description: "Shows the music queue",
		nameLocalizations: localizationMapByKey("Music.queue.name"),
		descriptionLocalizations: localizationMapByKey("Music.queue.description"),
	})
	@CommandConfig({ category: "🎵 Music", disable: false })
	@CommandPermissions({
		bot: ["Connect", "EmbedLinks", "DeafenMembers", "Speak"],
		user: ["Connect", "SendMessages"],
		guildOnly: false,testOnly: true,
		ownerOnly: false,
	})
	@UseGuards(CommandConfigGuard, CommandPermissionsGuard)
	public async onCommandRun(
		@Ctx() [interaction]: SlashCommandContext,
		@CurrentTranslate() t: TranslationFn,
	): Promise<Message> {
		if (!(await this.service.checkers(interaction))) {
			return;
		}

		const player = await this.service.getPlayer(interaction);

		const embeds: EmbedBuilder[] = [];
		const queue: (Track | UnresolvedTrack)[] = player.queue.tracks;

		for (const track of queue) {
			const Requester = await this.users.fetch(track.requester as string);

			embeds.push(
				new EmbedBuilder()
					.setAuthor({
						name: this.client.user.username,
						iconURL: this.client.user.displayAvatarURL(),
					})
					.setTitle(
						t("Events.PlayerEvents.trackStart.Embed.Title", {
							TITLE: track.info.title,
						}),
					)
					.setThumbnail(track.info.artworkUrl)
					.addFields([
						{
							name: t("Events.PlayerEvents.trackStart.Embed.Fields.1", {
								EMOJI: (await this.service.URLChecker(false, track.info.uri)).Emoji,
							}),
							value: `> ${t("Events.PlayerEvents.trackStart.Embed.Fields.Content.1", {
								Platform: this.service.formatSourceName(track.info.sourceName),
								URI: track.info.uri,
							})}`,
							inline: true,
						},
						{
							name: t("Events.PlayerEvents.trackStart.Embed.Fields.2", interaction.guild.preferredLocale),
							value: `> ${t("Events.PlayerEvents.trackStart.Embed.Fields.Content.2", {
								AUTHOR: track.info.author,
							})}`,
							inline: true,
						},
						{
							name: t("Events.PlayerEvents.trackStart.Embed.Fields.3", interaction.guild.preferredLocale),
							value: `> ${
								track.info.isStream
									? t("Events.PlayerEvents.trackStart.Embed.Fields.Content.3²", interaction.guild.preferredLocale)
									: t("Events.PlayerEvents.trackStart.Embed.Fields.Content.3", {
											TIMER: await Timer(t, "normal", track.info.duration, interaction.guildLocale),
										})
							}`,
							inline: true,
						},
					])
					.setColor("#00c26f")
					.setFooter({
						text: t("Events.PlayerEvents.trackStart.Embed.Footer", {
							REQUESTER: Requester.username,
						}),
						iconURL: Requester.displayAvatarURL(),
					})
					.setTimestamp(),
			);
		}

		await interaction.reply({
			embeds: [
				(await this.NDBService.buildPaginator(interaction, embeds, `queue-${interaction.guild.id}`)) as EmbedBuilder,
			],
		});
	}
}
