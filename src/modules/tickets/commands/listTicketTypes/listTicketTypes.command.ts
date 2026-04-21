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
import { Tickets } from "../../types/constants";
import { TicketCommand } from "../tickets.decorator";

@TicketCommand()
export class ListTicketTypesCommand {
	public constructor(
		@Inject(Tickets.Service) private readonly service: ITicketsService,
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

		const embed = new EmbedBuilder()
			.setTitle(t("Tickets.list.embed.title"))
			.setColor(0x5865f2)
			.addFields(
				ticketTypes.map((type) => ({
					name: `${type.emoji} ${type.name}`,
					value: type.description,
					inline: false,
				})),
			)
			.setFooter({
				text: t("Tickets.list.embed.footer", {
					COUNT: ticketTypes.length.toString(),
				}),
			});

		return interaction.reply({
			embeds: [embed],
			flags: MessageFlags.Ephemeral,
		});
	}
}
