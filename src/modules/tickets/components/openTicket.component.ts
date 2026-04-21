import {
	LOCALIZATION_ADAPTER,
	type NestedLocalizationAdapter,
} from "@necord/localization";
import { Inject, Injectable, Logger } from "@nestjs/common";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type CategoryChannel,
	ChannelType,
	EmbedBuilder,
	MessageFlags,
	PermissionFlagsBits,
	StringSelectMenuBuilder,
} from "discord.js";
import { Button, type ButtonContext, Context, type StringSelectContext, StringSelect } from "necord";
import type { ITicketsService } from "../interfaces";
import { Tickets } from "../types/constants";

@Injectable()
export class OpenTicketComponent {
	private readonly logger = new Logger(OpenTicketComponent.name);

	public constructor(
		@Inject(Tickets.Service) private readonly service: ITicketsService,
		@Inject(LOCALIZATION_ADAPTER)
		private readonly translate: NestedLocalizationAdapter,
	) {}

	@Button("ticket/panel_open")
	public async onPanelOpen(
		@Context() [interaction]: ButtonContext,
	) {
		const t = (key: string, args?: Record<string, string>) =>
			this.translate.getTranslation(key, interaction.guildLocale, args);

		const ticketTypes = await this.service.getTicketTypes(interaction.guildId);

		if (ticketTypes.length === 0) {
			return interaction.reply({
				content: t("Tickets.setup.no_types"),
				flags: MessageFlags.Ephemeral,
			});
		}

		const selectMenu = new StringSelectMenuBuilder()
			.setCustomId("ticket/select_type")
			.setPlaceholder(t("Tickets.setup.embed.select_placeholder"))
			.addOptions(
				ticketTypes.map((type) => ({
					label: type.name,
					description: type.description.length > 100
						? `${type.description.slice(0, 97)}...`
						: type.description,
					value: type.id,
					emoji: type.emoji,
				})),
			);

		const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

		const embed = new EmbedBuilder()
			.setTitle(t("Tickets.open.embed.select_title"))
			.setDescription(t("Tickets.open.embed.select_description"))
			.setColor(0x5865f2);

		return interaction.reply({
			embeds: [embed],
			components: [row],
			flags: MessageFlags.Ephemeral,
		});
	}

	@StringSelect("ticket/select_type")
	public async onSelectType(
		@Context() [interaction]: StringSelectContext,
	) {
		const ticketTypeId = interaction.values[0];
		const t = (key: string, args?: Record<string, string>) =>
			this.translate.getTranslation(key, interaction.guildLocale, args);

		const ticketType = await this.service.getTicketTypeById(ticketTypeId);

		if (!ticketType) {
			return interaction.update({
				content: t("Tickets.open.type_not_found"),
				embeds: [],
				components: [],
			});
		}

		const hasOpen = await this.service.hasOpenTicket(
			interaction.user.id,
			interaction.guildId,
			ticketTypeId,
		);

		if (hasOpen) {
			return interaction.update({
				content: t("Tickets.open.already_open"),
				embeds: [],
				components: [],
			});
		}

		const ticketTypes = await this.service.getTicketTypes(interaction.guildId);

		const selectMenu = new StringSelectMenuBuilder()
			.setCustomId("ticket/select_type")
			.setPlaceholder(t("Tickets.setup.embed.select_placeholder"))
			.addOptions(
				ticketTypes.map((type) => ({
					label: type.name,
					description: type.description.length > 100
						? `${type.description.slice(0, 97)}...`
						: type.description,
					value: type.id,
					emoji: type.emoji,
					default: type.id === ticketTypeId,
				})),
			);

		const selectRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

		const embed = new EmbedBuilder()
			.setTitle(`${ticketType.emoji} ${ticketType.name}`)
			.setDescription(ticketType.description)
			.setColor(0x5865f2)
			.setFooter({ text: t("Tickets.open.embed.confirm_footer") });

		const openButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId(`ticket/open/${ticketTypeId}`)
				.setLabel(t("Tickets.open.button"))
				.setEmoji("🎫")
				.setStyle(ButtonStyle.Success),
		);

		return interaction.update({
			embeds: [embed],
			components: [selectRow, openButton],
		});
	}

	@Button("ticket/open/:ticketTypeId")
	public async onOpenTicket(
		@Context() [interaction]: ButtonContext,
	) {
		const ticketTypeId = interaction.customId.split("/")[2];
		const t = (key: string, args?: Record<string, string>) =>
			this.translate.getTranslation(key, interaction.guildLocale, args);

		const ticketType = await this.service.getTicketTypeById(ticketTypeId);

		if (!ticketType) {
			return interaction.update({
				content: t("Tickets.open.type_not_found"),
				embeds: [],
				components: [],
			});
		}

		const hasOpen = await this.service.hasOpenTicket(
			interaction.user.id,
			interaction.guildId,
			ticketTypeId,
		);

		if (hasOpen) {
			return interaction.update({
				content: t("Tickets.open.already_open"),
				embeds: [],
				components: [],
			});
		}

		await interaction.update({
			content: t("Tickets.open.creating"),
			embeds: [],
			components: [],
		});

		const globalSettings = await this.service.getPanelSettings(interaction.guildId);

		const supportRoleId = ticketType.supportRoleId || globalSettings?.ticketDefaultRole;
		const categoryId = ticketType.categoryId || globalSettings?.ticketDefaultCategory;
		const ticketMessage = ticketType.message || globalSettings?.ticketDefaultMessage || ticketType.description;

		const permissionOverwrites = [
			{
				id: interaction.guild.id,
				deny: [PermissionFlagsBits.ViewChannel],
			},
			{
				id: interaction.user.id,
				allow: [
					PermissionFlagsBits.ViewChannel,
					PermissionFlagsBits.SendMessages,
					PermissionFlagsBits.ReadMessageHistory,
					PermissionFlagsBits.AttachFiles,
				],
			},
			{
				id: interaction.client.user.id,
				allow: [
					PermissionFlagsBits.ViewChannel,
					PermissionFlagsBits.SendMessages,
					PermissionFlagsBits.ManageChannels,
				],
			},
		];

		if (supportRoleId) {
			permissionOverwrites.push({
				id: supportRoleId,
				allow: [
					PermissionFlagsBits.ViewChannel,
					PermissionFlagsBits.SendMessages,
					PermissionFlagsBits.ReadMessageHistory,
					PermissionFlagsBits.AttachFiles,
				],
			});
		}

		const parent = categoryId
			? (interaction.guild.channels.cache.get(categoryId) as CategoryChannel | undefined) ?? null
			: null;

		const ticketCount = await this.service.countTickets(interaction.guildId);
		const channelName = `ticket-${String(ticketCount + 1).padStart(4, "0")}-${interaction.user.username}`;

		const channel = await interaction.guild.channels.create({
			name: channelName,
			type: ChannelType.GuildText,
			parent,
			permissionOverwrites,
		});

		await this.service.createTicket({
			ticketTypeName: ticketType.name,
			guildId: interaction.guildId,
			userId: interaction.user.id,
			channelId: channel.id,
		});

		const ticketEmbed = new EmbedBuilder()
			.setTitle(`${ticketType.emoji} ${ticketType.name}`)
			.setDescription(ticketMessage)
			.setColor(0x5865f2)
			.setFooter({ text: t("Tickets.open.embed.footer") })
			.setTimestamp();

		const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId("ticket/close")
				.setLabel(t("Tickets.close.button"))
				.setEmoji("🔒")
				.setStyle(ButtonStyle.Danger),
			new ButtonBuilder()
				.setCustomId("ticket/transcript")
				.setLabel(t("Tickets.transcript.button"))
				.setEmoji("📋")
				.setStyle(ButtonStyle.Secondary),
		);

		await channel.send({
			content: `${interaction.user}`,
			embeds: [ticketEmbed],
			components: [actionRow],
		});

		await interaction.editReply({
			content: t("Tickets.open.success", { CHANNEL: channel.toString() }),
		});
	}
}
