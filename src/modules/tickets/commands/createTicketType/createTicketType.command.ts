import {
	CurrentTranslate,
	localizationMapByKey,
	type TranslationFn,
} from "@necord/localization";
import { Inject, UseGuards } from "@nestjs/common";
import {
	ContainerBuilder,
	MessageFlags,
	parseEmoji,
	SeparatorSpacingSize,
} from "discord.js";
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
// biome-ignore lint/style/useImportType: dependency injection
import { CommandsService } from "#src/modules/commands/Commands.service.js";
import { Colors } from "#src/types/Colors.js";
// biome-ignore lint/style/useImportType: dependency injection
import { TicketsService } from "../../tickets.service.js";
import { CreateTicketTypeError, Tickets } from "../../types/constants.js";
import { TicketCommand } from "../tickets.decorator.js";
// biome-ignore lint/style/useImportType: dependency injection
import { CreateTicketTypeDTO } from "./createTicketType.dto.js";

@TicketCommand()
export class CreateTicketTypeCommand {
	public constructor(
		@Inject(Tickets.Service) private readonly service: TicketsService,
		private readonly commandService: CommandsService,
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
		const parsed = parseEmoji(emoji);
		if (parsed?.id) {
			const resolved = interaction.client.emojis.cache.get(parsed.id);
			if (!resolved) {
				return interaction.reply({
					content: t("Tickets.type.emoji_not_found"),
					flags: MessageFlags.Ephemeral,
				});
			}
		}

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

		const COMMAND_MENTION = await this.commandService.getCommandMention(
			"tickets configure_type",
		);
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
								`**${t("Tickets.type.embed.fields.name")}:** ${name}\n**${t(
									"Tickets.type.embed.fields.description",
								)}:** ${description}\n**${t("Tickets.type.embed.fields.emoji")}:** ${emoji}\n**${t("Tickets.type.embed.fields.message")}:** ${message}`,
							),
					)
					.addSeparatorComponents((separator) =>
						separator.setSpacing(SeparatorSpacingSize.Large),
					)
					.addTextDisplayComponents((text) =>
						text.setContent(
							t("Tickets.type.embed.next_steps", { COMMAND_MENTION }),
						),
					)
					.setAccentColor(Colors.Primary),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}
}
