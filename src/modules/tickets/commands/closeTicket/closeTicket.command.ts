import {
	CurrentTranslate,
	localizationMapByKey,
	type TranslationFn,
} from "@necord/localization";
import { Inject, UseGuards } from "@nestjs/common";
import { EmbedBuilder, MessageFlags } from "discord.js";
import { Context, type SlashCommandContext, Subcommand } from "necord";
import {
	CommandConfig,
	CommandPermissions,
} from "@/common/decorators";
import { CommandConfigGuard, CommandPermissionsGuard } from "@/common/guards";
import type { ITicketsService } from "../../interfaces";
import { CloseTicketError, Tickets } from "../../types/constants";
import { TicketCommand } from "../tickets.decorator";

@TicketCommand()
export class CloseTicketCommand {
	public constructor(
		@Inject(Tickets.Service) private readonly service: ITicketsService,
	) {}

	@Subcommand({
		name: "close",
		nameLocalizations: localizationMapByKey("Tickets.close_cmd.name"),
		description: "Close the current ticket",
		descriptionLocalizations: localizationMapByKey("Tickets.close_cmd.description"),
	})
	@CommandConfig({ category: "🎫 Tickets", disable: false })
	@CommandPermissions({
		user: [],
		bot: ["ManageChannels"],
		guildOnly: false,
		ownerOnly: false,
		testOnly: true,
	})
	@UseGuards(CommandConfigGuard, CommandPermissionsGuard)
	public async onCommandRun(
		@Context() [interaction]: SlashCommandContext,
		@CurrentTranslate() t: TranslationFn,
	) {
		const result = await this.service.closeTicket(interaction.channelId);

		if (result === CloseTicketError.NotInTicketChannel) {
			return interaction.reply({
				content: t("Tickets.close.not_ticket_channel"),
				flags: MessageFlags.Ephemeral,
			});
		}

		const embed = new EmbedBuilder()
			.setTitle(t("Tickets.close.embed.title"))
			.setDescription(
				t("Tickets.close.embed.description", { USER: interaction.user.toString() }),
			)
			.setColor(0xed4245)
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });

		setTimeout(async () => {
			try {
				await interaction.channel.delete();
			} catch {}
		}, 5000);
	}
}
