import {
	CurrentTranslate,
	localizationMapByKey,
	type TranslationFn,
} from "@necord/localization";
import { Inject, UseGuards } from "@nestjs/common";
import { MessageFlags } from "discord.js";
import { Context, type SlashCommandContext, Subcommand } from "necord";
import {
	CommandConfig,
	CommandPermissions,
} from "@/common/decorators";
import { CommandConfigGuard, CommandPermissionsGuard } from "@/common/guards";
import type { ITicketsEmbeds, ITicketsService } from "../../interfaces";
import { Tickets } from "../../types/constants";
import { TicketCommand } from "../tickets.decorator";

@TicketCommand()
export class ListTicketTypesCommand {
	public constructor(
		@Inject(Tickets.Service) private readonly service: ITicketsService,
		@Inject(Tickets.Embeds) private readonly embeds: ITicketsEmbeds,
	) {}

	@Subcommand({
		name: "list",
		nameLocalizations: localizationMapByKey("Tickets.list.name"),
		description: "List all ticket types configured in this server",
		descriptionLocalizations: localizationMapByKey("Tickets.list.description"),
	})
	@CommandConfig({ category: "🎫 Tickets", disable: false })
	@CommandPermissions({
		user: ["ManageGuild"],
		bot: [],
		guildOnly: false,
		ownerOnly: false,
		testOnly: true,
	})
	@UseGuards(CommandConfigGuard, CommandPermissionsGuard)
	public async onCommandRun(
		@Context() [interaction]: SlashCommandContext,
		@CurrentTranslate() t: TranslationFn,
	) {
		const ticketTypes = await this.service.getTicketTypes(interaction.guildId);

		if (ticketTypes.length === 0) {
			return interaction.reply({
				content: t("Tickets.list.empty"),
				flags: MessageFlags.Ephemeral,
			});
		}

		return interaction.reply({
			embeds: [this.embeds.ListTypesEmbed(interaction.guildLocale, ticketTypes)],
			flags: MessageFlags.Ephemeral,
		});
	}
}
