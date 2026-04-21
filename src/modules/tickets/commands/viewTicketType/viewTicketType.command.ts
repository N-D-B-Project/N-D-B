import {
	CurrentTranslate,
	localizationMapByKey,
	type TranslationFn,
} from "@necord/localization";
import { Inject, UseGuards, UseInterceptors } from "@nestjs/common";
import {
	ContainerBuilder,
	MessageFlags,
	SeparatorSpacingSize,
} from "discord.js";
import { Context, Options, type SlashCommandContext, Subcommand } from "necord";
import {
	CommandConfig,
	CommandPermissions,
} from "@/common/decorators";
import { CommandConfigGuard, CommandPermissionsGuard } from "@/common/guards";
import type { ITicketsService } from "../../interfaces";
import { Tickets } from "../../types/constants";
import { TicketCommand } from "../tickets.decorator";
import { TicketTypeNameAutocomplete } from "../ticketTypeName.autocomplete";
// biome-ignore lint/style/useImportType: dependency injection
import { ViewTicketTypeDTO } from "./viewTicketType.dto";

@TicketCommand()
export class ViewTicketTypeCommand {
	public constructor(
		@Inject(Tickets.Service) private readonly service: ITicketsService,
	) {}

	@UseInterceptors(TicketTypeNameAutocomplete)
	@Subcommand({
		name: "view_type",
		nameLocalizations: localizationMapByKey("Tickets.view_type.name"),
		description: "View details of a ticket type",
		descriptionLocalizations: localizationMapByKey("Tickets.view_type.description"),
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
		@Options() { name }: ViewTicketTypeDTO,
		@CurrentTranslate() t: TranslationFn,
	) {
		const ticketType = await this.service.getTicketType(name);

		if (!ticketType) {
			return interaction.reply({
				content: t("Tickets.view_type.not_found"),
				flags: MessageFlags.Ephemeral,
			});
		}

		const role = ticketType.supportRoleId
			? `<@&${ticketType.supportRoleId}>`
			: t("Tickets.view_type.not_set");

		const category = ticketType.categoryId
			? `<#${ticketType.categoryId}>`
			: t("Tickets.view_type.not_set");

		const details = [
			`**${t("Tickets.view_type.fields.name")}:** ${ticketType.name}`,
			`**${t("Tickets.view_type.fields.emoji")}:** ${ticketType.emoji}`,
			`**${t("Tickets.view_type.fields.description")}:** ${ticketType.description}`,
			`**${t("Tickets.view_type.fields.message")}:** ${ticketType.message}`,
		].join("\n");

		const config = [
			`**${t("Tickets.view_type.fields.support_role")}:** ${role}`,
			`**${t("Tickets.view_type.fields.category")}:** ${category}`,
		].join("\n");

		return interaction.reply({
			components: [
				new ContainerBuilder()
					.addTextDisplayComponents((text) =>
						text.setContent(`## ${ticketType.emoji} ${ticketType.name}`),
					)
					.addSeparatorComponents((separator) =>
						separator.setSpacing(SeparatorSpacingSize.Large),
					)
					.addTextDisplayComponents(
						(text) => text.setContent(`### ${t("Tickets.view_type.section.details")}`),
						(text) => text.setContent(details),
					)
					.addSeparatorComponents((separator) =>
						separator.setSpacing(SeparatorSpacingSize.Small),
					)
					.addTextDisplayComponents(
						(text) => text.setContent(`### ${t("Tickets.view_type.section.config")}`),
						(text) => text.setContent(config),
					)
					.setAccentColor(0x5865f2),
			],
			flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
		});
	}
}
