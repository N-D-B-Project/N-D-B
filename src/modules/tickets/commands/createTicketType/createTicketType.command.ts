import {
	CurrentTranslate,
	localizationMapByKey,
	type TranslationFn,
} from "@necord/localization";
import { Inject, UseGuards } from "@nestjs/common";
import { EmbedBuilder } from "discord.js";
import { Context, type SlashCommandContext, Subcommand } from "necord";
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
			embeds: [
				new EmbedBuilder()
					.setTitle(t("Tickets.type.embed.title"))
					.addFields(
						{ name: t("Tickets.type.fields.name"), value: name, inline: true },
						{
							name: t("Tickets.type.fields.description"),
							value: description,
							inline: true,
						},
						{
							name: t("Tickets.type.fields.emoji"),
							value: emoji,
							inline: true,
						},
						{
							name: t("Tickets.type.fields.message"),
							value: message,
							inline: true,
						},
					)
					.setColor("Green")
					.setTimestamp(),
			],
		});
	}
}
