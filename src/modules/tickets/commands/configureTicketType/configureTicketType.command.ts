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
import { ConfigureTicketTypeError, Tickets } from "../../types/constants";
import { TicketCommand } from "../tickets.decorator";
import { TicketTypeNameAutocomplete } from "../ticketTypeName.autocomplete";
// biome-ignore lint/style/useImportType: dependency injection
import { ConfigureTicketTypeDTO } from "./configureTicketType.dto";

@TicketCommand()
export class ConfigureTicketTypeCommand {
	public constructor(
		@Inject(Tickets.Service) private readonly service: ITicketsService,
	) {}

	@UseInterceptors(TicketTypeNameAutocomplete)
	@Subcommand({
		name: "configure_type",
		nameLocalizations: localizationMapByKey("Tickets.configure_type.name"),
		description: "Configure a ticket type",
		descriptionLocalizations: localizationMapByKey(
			"Tickets.configure_type.description",
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
		@Options() { name, support_role, category, description, message, emoji }: ConfigureTicketTypeDTO,
		@CurrentTranslate() t: TranslationFn,
	) {
		if (!support_role && !category && !description && !message && !emoji) {
			return interaction.reply({
				content: t("Tickets.configure_type.no_options"),
				flags: MessageFlags.Ephemeral,
			});
		}

		const result = await this.service.configureTicketType({
			name,
			guildId: interaction.guildId,
			supportRoleId: support_role?.id,
			categoryId: category?.id,
			description,
			message,
			emoji,
		});

		if (result === ConfigureTicketTypeError.NotFound) {
			return interaction.reply({
				content: t("Tickets.configure_type.not_found"),
				flags: MessageFlags.Ephemeral,
			});
		}

		const changes: string[] = [];
		if (support_role) {
			changes.push(
				`**${t("Tickets.configure_type.fields.support_role")}:** ${support_role}`,
			);
		}
		if (category) {
			changes.push(
				`**${t("Tickets.configure_type.fields.category")}:** ${category}`,
			);
		}
		if (description) {
			changes.push(
				`**${t("Tickets.configure_type.fields.description")}:** ${description}`,
			);
		}
		if (message) {
			changes.push(
				`**${t("Tickets.configure_type.fields.message")}:** ${message}`,
			);
		}
		if (emoji) {
			changes.push(
				`**${t("Tickets.configure_type.fields.emoji")}:** ${emoji}`,
			);
		}

		return interaction.reply({
			components: [
				new ContainerBuilder()
					.addTextDisplayComponents((text) =>
						text.setContent(
							`## ${t("Tickets.configure_type.embed.title")}`,
						),
					)
					.addSeparatorComponents((separator) =>
						separator.setSpacing(SeparatorSpacingSize.Large),
					)
					.addTextDisplayComponents(
						(text) =>
							text.setContent(
								`**${t("Tickets.configure_type.embed.type")}:** ${result.emoji} ${result.name}`,
							),
						(text) =>
							text.setContent(
								`### ${t("Tickets.configure_type.embed.updated")}\n${changes.join("\n")}`,
							),
					)
					.setAccentColor(0x00ff00),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}
}
