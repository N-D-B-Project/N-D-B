import {
	CurrentTranslate,
	localizationMapByKey,
	type TranslationFn,
} from "@necord/localization";
import { Inject, UseGuards } from "@nestjs/common";
import {
	ButtonStyle,
	ContainerBuilder,
	MessageFlags,
	SeparatorSpacingSize,
} from "discord.js";
import { Button, Context, type SlashCommandContext, Subcommand } from "necord";
import {
	CommandConfig,
	CommandPermissions,
	ValidatedOptions,
} from "@/common/decorators";
import { CommandConfigGuard, CommandPermissionsGuard } from "@/common/guards";
// biome-ignore lint/style/useImportType: dependency injection
import { TicketsService } from "../../tickets.service";
import { CreateTicketTypeError, Tickets } from "../../types/constants";
import { TicketCommand } from "../tickets.decorator";
// biome-ignore lint/style/useImportType: dependency injection
import { CreateTicketTypeDTO } from "./createTicketType.dto";

@TicketCommand()
export class CreateTicketTypeCommand {
	public constructor(
		@Inject(Tickets.Service) private readonly service: TicketsService,
	) {}

	@Subcommand({
		name: "create_type",
		nameLocalizations: localizationMapByKey("Tickets.type.name"),
		description: "Create a type of ticket",
		descriptionLocalizations: localizationMapByKey("Tickets.type.description"),
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
		@ValidatedOptions() {
			description,
			emoji,
			message,
			name,
		}: CreateTicketTypeDTO,
		@CurrentTranslate() t: TranslationFn,
	) {
		const ticketType = await this.service.createTicketType({
			description,
			emoji,
			message,
			name,
			guildId: interaction.guildId,
		});

		if (ticketType === CreateTicketTypeError.Count) {
			return interaction.reply({
				content: t("Tickets.type.max_types"),
			});
		}

		if (ticketType === CreateTicketTypeError.Exists) {
			return interaction.reply({
				content: t("Tickets.type.exists"),
			});
		}

		return interaction.reply({
			components: [
				new ContainerBuilder()
					.addTextDisplayComponents((text) =>
						text.setContent(`## ${t("Tickets.type.embed.title")}`),
					)
					.addSeparatorComponents((separator) =>
						separator.setSpacing(SeparatorSpacingSize.Large),
					)
					.addTextDisplayComponents(
						(text) => text.setContent(`### ${t("Tickets.type.embed.details")}`),
						(text) =>
							text.setContent(
								`> **${t("Tickets.type.embed.fields.name")}:** ${name}\n> **${t(
									"Tickets.type.embed.fields.description",
								)}:** ${description}\n> **${t("Tickets.type.embed.fields.emoji")}:** ${emoji}\n> **${t("Tickets.type.embed.fields.message")}:** ${message}`,
							),
					)
					.addSeparatorComponents((separator) =>
						separator.setSpacing(SeparatorSpacingSize.Large),
					)
					.addSectionComponents((section) =>
						section
							.addTextDisplayComponents((text) =>
								text.setContent(
									`${t("Tickets.type.embed.next_steps", { COMMAND_MENTION: /*`</tickets create_type:1416948691612340300>`*/ "COMMAND NOT AVAILABLE" })}\n${t("Tickets.type.embed.configure")}`,
								),
							)
							.setButtonAccessory((button) =>
								button
									.setLabel(t("Tickets.type.embed.start_configure"))
									.setCustomId("configure")
									.setStyle(ButtonStyle.Primary),
							),
					)
					.setAccentColor(0x00ff00),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}

	@Button("configure")
	public async onConfigure(@Context() [interaction]: SlashCommandContext) {
		return interaction.reply({
			content: "This feature is not implemented yet.",
			flags: MessageFlags.Ephemeral,
		});
	}
}
