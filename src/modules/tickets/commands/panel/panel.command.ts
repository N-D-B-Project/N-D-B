import {
	CurrentTranslate,
	localizationMapByKey,
	type TranslationFn,
} from "@necord/localization";
import { Inject, UseGuards } from "@nestjs/common";
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
import type { PanelSettings } from "../../types/constants";
import { Tickets } from "../../types/constants";
import { TicketCommand } from "../tickets.decorator";
// biome-ignore lint/style/useImportType: dependency injection
import { PanelDTO } from "./panel.dto";

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;
const URL_REGEX = /^https?:\/\/.+/;

@TicketCommand()
export class PanelCommand {
	public constructor(
		@Inject(Tickets.Service) private readonly service: ITicketsService,
	) {}

	@Subcommand({
		name: "panel",
		nameLocalizations: localizationMapByKey("Tickets.panel.name"),
		description: "Customize the ticket panel appearance",
		descriptionLocalizations: localizationMapByKey("Tickets.panel.description"),
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
		@Options() { title, description, color, thumbnail, image, footer, button_label, button_emoji, default_role, default_category, default_message }: PanelDTO,
		@CurrentTranslate() t: TranslationFn,
	) {
		const hasAnyOption = title || description || color || thumbnail || image || footer || button_label || button_emoji || default_role || default_category || default_message;

		if (!hasAnyOption) {
			return this.showCurrentSettings(interaction, t);
		}

		if (color && !HEX_COLOR_REGEX.test(color)) {
			return interaction.reply({
				content: t("Tickets.panel.invalid_color"),
				flags: MessageFlags.Ephemeral,
			});
		}

		if (thumbnail && !URL_REGEX.test(thumbnail)) {
			return interaction.reply({
				content: t("Tickets.panel.invalid_url", { FIELD: t("Tickets.panel.fields.thumbnail") }),
				flags: MessageFlags.Ephemeral,
			});
		}

		if (image && !URL_REGEX.test(image)) {
			return interaction.reply({
				content: t("Tickets.panel.invalid_url", { FIELD: t("Tickets.panel.fields.image") }),
				flags: MessageFlags.Ephemeral,
			});
		}

		const data: Partial<PanelSettings> = {};
		const changes: string[] = [];

		if (title) {
			data.ticketPanelTitle = title;
			changes.push(`**${t("Tickets.panel.fields.title")}:** ${title}`);
		}
		if (description) {
			data.ticketPanelDesc = description;
			changes.push(`**${t("Tickets.panel.fields.description")}:** ${description}`);
		}
		if (color) {
			data.ticketPanelColor = color;
			changes.push(`**${t("Tickets.panel.fields.color")}:** ${color}`);
		}
		if (thumbnail) {
			data.ticketPanelThumbnail = thumbnail;
			changes.push(`**${t("Tickets.panel.fields.thumbnail")}:** ${thumbnail}`);
		}
		if (image) {
			data.ticketPanelImage = image;
			changes.push(`**${t("Tickets.panel.fields.image")}:** ${image}`);
		}
		if (footer) {
			data.ticketPanelFooter = footer;
			changes.push(`**${t("Tickets.panel.fields.footer")}:** ${footer}`);
		}
		if (button_label) {
			data.ticketPanelBtnLabel = button_label;
			changes.push(`**${t("Tickets.panel.fields.button_label")}:** ${button_label}`);
		}
		if (button_emoji) {
			data.ticketPanelBtnEmoji = button_emoji;
			changes.push(`**${t("Tickets.panel.fields.button_emoji")}:** ${button_emoji}`);
		}
		if (default_role) {
			data.ticketDefaultRole = default_role.id;
			changes.push(`**${t("Tickets.panel.fields.default_role")}:** ${default_role}`);
		}
		if (default_category) {
			data.ticketDefaultCategory = default_category.id;
			changes.push(`**${t("Tickets.panel.fields.default_category")}:** ${default_category}`);
		}
		if (default_message) {
			data.ticketDefaultMessage = default_message;
			changes.push(`**${t("Tickets.panel.fields.default_message")}:** ${default_message}`);
		}

		await this.service.updatePanelSettings(interaction.guildId, data);

		return interaction.reply({
			components: [
				new ContainerBuilder()
					.addTextDisplayComponents((text) =>
						text.setContent(`## ${t("Tickets.panel.embed.updated_title")}`),
					)
					.addSeparatorComponents((separator) =>
						separator.setSpacing(SeparatorSpacingSize.Large),
					)
					.addTextDisplayComponents((text) =>
						text.setContent(changes.join("\n")),
					)
					.setAccentColor(0x00ff00),
			],
			flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
		});
	}

	private async showCurrentSettings(
		interaction: import("discord.js").ChatInputCommandInteraction,
		t: TranslationFn,
	) {
		const current = await this.service.getPanelSettings(interaction.guildId);
		const none = t("Tickets.panel.none");

		const currentColor = current?.ticketPanelColor || "#5865F2";

		const appearanceLines = [
			`**${t("Tickets.panel.fields.title")}:** ${current?.ticketPanelTitle || t("Tickets.setup.embed.title")}`,
			`**${t("Tickets.panel.fields.description")}:** ${current?.ticketPanelDesc || t("Tickets.setup.embed.description")}`,
			`**${t("Tickets.panel.fields.color")}:** ${currentColor}`,
			`**${t("Tickets.panel.fields.thumbnail")}:** ${current?.ticketPanelThumbnail || none}`,
			`**${t("Tickets.panel.fields.image")}:** ${current?.ticketPanelImage || none}`,
			`**${t("Tickets.panel.fields.footer")}:** ${current?.ticketPanelFooter || none}`,
			`**${t("Tickets.panel.fields.button_label")}:** ${current?.ticketPanelBtnLabel || t("Tickets.setup.embed.open_button")}`,
			`**${t("Tickets.panel.fields.button_emoji")}:** ${current?.ticketPanelBtnEmoji || "🎫"}`,
		];

		const defaultRole = current?.ticketDefaultRole
			? `<@&${current.ticketDefaultRole}>`
			: none;
		const defaultCategory = current?.ticketDefaultCategory
			? `<#${current.ticketDefaultCategory}>`
			: none;

		const defaultLines = [
			`**${t("Tickets.panel.fields.default_role")}:** ${defaultRole}`,
			`**${t("Tickets.panel.fields.default_category")}:** ${defaultCategory}`,
			`**${t("Tickets.panel.fields.default_message")}:** ${current?.ticketDefaultMessage || none}`,
		];

		return interaction.reply({
			components: [
				new ContainerBuilder()
					.addTextDisplayComponents((text) =>
						text.setContent(`## ${t("Tickets.panel.embed.current_title")}`),
					)
					.addSeparatorComponents((separator) =>
						separator.setSpacing(SeparatorSpacingSize.Large),
					)
					.addTextDisplayComponents((text) =>
						text.setContent(`### ${t("Tickets.panel.sections.appearance")}\n${appearanceLines.join("\n")}`),
					)
					.addSeparatorComponents((separator) =>
						separator.setSpacing(SeparatorSpacingSize.Small),
					)
					.addTextDisplayComponents((text) =>
						text.setContent(`### ${t("Tickets.panel.sections.defaults")}\n${defaultLines.join("\n")}`),
					)
					.setAccentColor(Number.parseInt(currentColor.replace("#", ""), 16)),
			],
			flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
		});
	}
}
