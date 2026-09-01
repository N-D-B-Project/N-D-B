import {
	CurrentTranslate,
	localizationMapByKey,
	type TranslationFn,
} from "@necord/localization";
import { Inject, UseGuards, UseInterceptors } from "@nestjs/common";
import { MessageFlags } from "discord.js";
import { Context, type SlashCommandContext, Subcommand } from "necord";
import {
	CommandConfig,
	CommandPermissions,
	ValidatedOptions,
} from "#src/common/decorators/index.js";
import {
	CommandConfigGuard,
	CommandPermissionsGuard,
} from "#src/common/guards/index.js";
import type { ITicketsService } from "../../interfaces/index.js";
import { DeleteTicketTypeError, Tickets } from "../../types/constants.js";
import { TicketCommand } from "../tickets.decorator.js";
import { TicketTypeNameAutocomplete } from "../ticketTypeName.autocomplete.js";
// biome-ignore lint/style/useImportType: dependency injection
import { DeleteTicketTypeDTO } from "./deleteTicketType.dto.js";

@TicketCommand()
export class DeleteTicketTypeCommand {
	public constructor(
		@Inject(Tickets.Service) private readonly service: ITicketsService,
	) {}

	@UseInterceptors(TicketTypeNameAutocomplete)
	@Subcommand({
		name: "delete_type",
		nameLocalizations: localizationMapByKey("Tickets.delete_type.name"),
		description: "Delete a ticket type",
		descriptionLocalizations: localizationMapByKey(
			"Tickets.delete_type.description",
		),
	})
	@CommandConfig({ category: "🎫 Tickets", disable: false })
	@CommandPermissions({
		user: ["ManageGuild"],
		bot: ["ManageChannels"],
		guildOnly: false,
		ownerOnly: false,
		testOnly: true,
	})
	@UseGuards(CommandConfigGuard, CommandPermissionsGuard)
	public async onCommandRun(
		@Context() [interaction]: SlashCommandContext,
		@ValidatedOptions() { name }: DeleteTicketTypeDTO,
		@CurrentTranslate() t: TranslationFn,
	) {
		const result = await this.service.deleteTicketType(
			name,
			interaction.guildId,
		);

		if (result === DeleteTicketTypeError.NotFound) {
			return interaction.reply({
				content: t("Tickets.delete_type.not_found"),
				flags: MessageFlags.Ephemeral,
			});
		}

		return interaction.reply({
			content: t("Tickets.delete_type.success", { NAME: name }),
			flags: MessageFlags.Ephemeral,
		});
	}
}
