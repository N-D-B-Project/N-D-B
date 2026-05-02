import {
	LOCALIZATION_ADAPTER,
	type NestedLocalizationAdapter,
} from "@necord/localization";
import { Inject, Injectable, Logger } from "@nestjs/common";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	MessageFlags,
	type TextChannel,
} from "discord.js";
import { Button, type ButtonContext, Context } from "necord";
import type { ITicketsEmbeds, ITicketsService } from "../interfaces";
import type { TranscriptService } from "../services/transcript.service";
import { Tickets } from "../types/constants";

@Injectable()
export class CloseTicketComponent {
	private readonly logger = new Logger(CloseTicketComponent.name);

	public constructor(
		@Inject(Tickets.Service) private readonly service: ITicketsService,
		@Inject(Tickets.Embeds) private readonly embeds: ITicketsEmbeds,
		@Inject(LOCALIZATION_ADAPTER)
		private readonly translate: NestedLocalizationAdapter,
		private readonly transcriptService: TranscriptService,
	) {}

	@Button("ticket/close")
	public async onCloseTicket(@Context() [interaction]: ButtonContext) {
		const t = (key: string, args?: Record<string, string>) =>
			this.translate.getTranslation(key, interaction.guildLocale, args);

		const confirmRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId("ticket/close/confirm")
				.setLabel(t("Tickets.close.confirm"))
				.setStyle(ButtonStyle.Danger),
			new ButtonBuilder()
				.setCustomId("ticket/close/cancel")
				.setLabel(t("Tickets.close.cancel"))
				.setStyle(ButtonStyle.Secondary),
		);

		return interaction.reply({
			content: t("Tickets.close.confirm_message"),
			components: [confirmRow],
			flags: MessageFlags.Ephemeral,
		});
	}

	@Button("ticket/close/confirm")
	public async onConfirmClose(@Context() [interaction]: ButtonContext) {
		const t = (key: string, args?: Record<string, string>) =>
			this.translate.getTranslation(key, interaction.guildLocale, args);

		const result = await this.service.closeTicket(interaction.channelId);

		if (typeof result === "string") {
			return interaction.reply({
				content: t("Tickets.close.not_ticket_channel"),
				flags: MessageFlags.Ephemeral,
			});
		}

		await interaction.update({
			content: t("Tickets.close.closing"),
			components: [],
		});

		const channel = interaction.channel as TextChannel;

		try {
			const messages = await this.transcriptService.fetchMessages(channel);

			if (messages.length > 0) {
				const guildName = interaction.guild.name;
				const channelName = channel.name;

				const txt = this.transcriptService.generateTxt(
					messages,
					channelName,
					guildName,
				);
				const html = this.transcriptService.generateHtml(
					messages,
					channelName,
					guildName,
				);

				const ticketOwnerId = result.userId;
				if (ticketOwnerId) {
					const owner = await interaction.client.users
						.fetch(ticketOwnerId)
						.catch(() => null);
					if (owner) {
						await owner
							.send({
								content: t("Tickets.transcript.close_dm", {
									CHANNEL: channelName,
									GUILD: guildName,
								}),
								files: [txt, html],
							})
							.catch(() => {
								this.logger.warn(
									`Could not DM close transcript to ${ticketOwnerId}`,
								);
							});
					}
				}
			}
		} catch (error) {
			this.logger.error(`Failed to generate close transcript: ${error}`);
		}

		await interaction.channel.send({
			embeds: [
				this.embeds.CloseTicketEmbed(interaction.guildLocale, interaction.user),
			],
		});

		setTimeout(async () => {
			try {
				await interaction.channel.delete();
			} catch (error) {
				this.logger.error(`Failed to delete ticket channel: ${error}`);
			}
		}, 5000);
	}

	@Button("ticket/close/cancel")
	public async onCancelClose(@Context() [interaction]: ButtonContext) {
		const t = (key: string, args?: Record<string, string>) =>
			this.translate.getTranslation(key, interaction.guildLocale, args);

		return interaction.update({
			content: t("Tickets.close.cancelled"),
			components: [],
		});
	}
}
