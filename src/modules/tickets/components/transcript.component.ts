import {
	LOCALIZATION_ADAPTER,
	type NestedLocalizationAdapter,
} from "@necord/localization";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { MessageFlags, type TextChannel } from "discord.js";
import { Button, type ButtonContext, Context } from "necord";
import { TranscriptService } from "../services/transcript.service";

@Injectable()
export class TranscriptComponent {
	private readonly logger = new Logger(TranscriptComponent.name);

	public constructor(
		private readonly transcriptService: TranscriptService,
		@Inject(LOCALIZATION_ADAPTER)
		private readonly translate: NestedLocalizationAdapter,
	) {}

	@Button("ticket/transcript")
	public async onTranscript(
		@Context() [interaction]: ButtonContext,
	) {
		const t = (key: string, args?: Record<string, string>) =>
			this.translate.getTranslation(key, interaction.guildLocale, args);

		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		try {
			const channel = interaction.channel as TextChannel;
			const messages = await this.transcriptService.fetchMessages(channel);

			if (messages.length === 0) {
				return interaction.editReply({
					content: t("Tickets.transcript.empty"),
				});
			}

			const guildName = interaction.guild.name;
			const channelName = channel.name;

			const txt = this.transcriptService.generateTxt(messages, channelName, guildName);
			const html = this.transcriptService.generateHtml(messages, channelName, guildName);

			await interaction.user.send({
				content: t("Tickets.transcript.dm_message", { CHANNEL: channelName }),
				files: [txt, html],
			}).catch(() => {
				this.logger.warn(`Could not DM transcript to ${interaction.user.id}`);
			});

			return interaction.editReply({
				content: t("Tickets.transcript.sent"),
			});
		} catch (error) {
			this.logger.error(`Failed to generate transcript: ${error}`);
			return interaction.editReply({
				content: t("Tickets.transcript.error"),
			});
		}
	}
}
