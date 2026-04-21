import {
	CurrentTranslate,
	localizationMapByKey,
	type TranslationFn,
} from "@necord/localization";
import { Inject, UseGuards } from "@nestjs/common";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
	EmbedBuilder,
	MessageFlags,
	type TextChannel,
} from "discord.js";
import { ChannelOption, Context, Options, type SlashCommandContext, Subcommand } from "necord";
import {
	CommandConfig,
	CommandPermissions,
} from "@/common/decorators";
import { CommandConfigGuard, CommandPermissionsGuard } from "@/common/guards";
import type { ITicketsService } from "../../interfaces";
import { Tickets } from "../../types/constants";
import { TicketCommand } from "../tickets.decorator";

class SetupDTO {
	@ChannelOption({
		name: "channel",
		name_localizations: localizationMapByKey("Tickets.setup.options.channel.name"),
		description: "The channel to send the ticket panel to",
		description_localizations: localizationMapByKey("Tickets.setup.options.channel.description"),
		required: true,
		channel_types: [ChannelType.GuildText],
	})
	public readonly channel!: TextChannel;
}

@TicketCommand()
export class SetupCommand {
	public constructor(
		@Inject(Tickets.Service) private readonly service: ITicketsService,
	) {}

	@Subcommand({
		name: "setup",
		nameLocalizations: localizationMapByKey("Tickets.setup.name"),
		description: "Send the ticket panel to a channel",
		descriptionLocalizations: localizationMapByKey("Tickets.setup.description"),
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
		@Options() { channel }: SetupDTO,
		@CurrentTranslate() t: TranslationFn,
	) {
		const [ticketTypes, panelSettings] = await Promise.all([
			this.service.getTicketTypes(interaction.guildId),
			this.service.getPanelSettings(interaction.guildId),
		]);

		if (ticketTypes.length === 0) {
			return interaction.reply({
				content: t("Tickets.setup.no_types"),
				flags: MessageFlags.Ephemeral,
			});
		}

		const panelTitle = panelSettings?.ticketPanelTitle || t("Tickets.setup.embed.title");
		const panelDesc = panelSettings?.ticketPanelDesc || t("Tickets.setup.embed.description");
		const panelColor = panelSettings?.ticketPanelColor
			? Number.parseInt(panelSettings.ticketPanelColor.replace("#", ""), 16)
			: 0x5865f2;
		const btnLabel = panelSettings?.ticketPanelBtnLabel || t("Tickets.setup.embed.open_button");
		const btnEmoji = panelSettings?.ticketPanelBtnEmoji || "🎫";

		const embed = new EmbedBuilder()
			.setTitle(panelTitle)
			.setDescription(panelDesc)
			.setColor(panelColor);

		if (panelSettings?.ticketPanelThumbnail) {
			embed.setThumbnail(panelSettings.ticketPanelThumbnail);
		}
		if (panelSettings?.ticketPanelImage) {
			embed.setImage(panelSettings.ticketPanelImage);
		}
		if (panelSettings?.ticketPanelFooter) {
			embed.setFooter({ text: panelSettings.ticketPanelFooter });
		}

		const openButton = new ButtonBuilder()
			.setCustomId("ticket/panel_open")
			.setLabel(btnLabel)
			.setEmoji(btnEmoji)
			.setStyle(ButtonStyle.Primary);

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(openButton);

		await channel.send({
			embeds: [embed],
			components: [row],
		});

		return interaction.reply({
			content: t("Tickets.setup.success", { CHANNEL: channel.toString() }),
			flags: MessageFlags.Ephemeral,
		});
	}
}
