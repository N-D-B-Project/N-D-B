import {
	CurrentTranslate,
	LOCALIZATION_ADAPTER,
	localizationMapByKey,
	type NestedLocalizationAdapter,
	type TranslationFn,
} from "@necord/localization";
import { Inject } from "@nestjs/common";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	channelMention,
	EmbedBuilder,
	type Guild,
	MessageFlags,
	roleMention,
	type TextChannel,
} from "discord.js";
import {
	Button,
	type ButtonContext,
	ComponentParam,
	Ctx,
	Options,
	type SlashCommandContext,
	Subcommand,
} from "necord";
import { CommandConfig, CommandPermissions } from "@/common/decorators";
import type { IReactionRolesService } from "../../interfaces";
import { ReactionRolesCommand } from "../../ReactionRoles.decorator";
import { ReactionRoles } from "../../types/constants";
// biome-ignore lint/style/useImportType: <Cannot useImportType in classes with validation system>
import { ListReactionsDTO } from "./ListReactions.dto";

const PAGE_SIZE = 5;

interface ReactionItem {
	channel: string;
	message: string;
	role: string;
	emoji: string;
	option: number;
}

@ReactionRolesCommand()
export class ListReactionsCommand {
	public constructor(
		@Inject(ReactionRoles.Service)
		private readonly reaction: IReactionRolesService,
		@Inject(LOCALIZATION_ADAPTER)
		private readonly translate: NestedLocalizationAdapter,
	) {}

	@Subcommand({
		name: "list",
		description: "List all ReactionRoles in the server",
		nameLocalizations: localizationMapByKey("ReactionRoles.list.name"),
		descriptionLocalizations: localizationMapByKey(
			"ReactionRoles.list.description",
		),
	})
	@CommandConfig({ category: "🎩 ReactionRole", disable: false })
	@CommandPermissions({
		user: ["SendMessages", "ManageRoles"],
		bot: ["EmbedLinks"],
		guildOnly: false,
		testOnly: false,
		ownerOnly: false,
	})
	public async onCommandRun(
		@Ctx() [interaction]: SlashCommandContext,
		@Options() { channel }: ListReactionsDTO,
		@CurrentTranslate() t: TranslationFn,
	) {
		const reactions = channel
			? await this.reaction.getInChannel(interaction.guild, channel as TextChannel)
			: await this.reaction.getAll(interaction.guild);

		if (reactions.length === 0) {
			return interaction.reply({
				content: t("ReactionRoles.list.empty"),
				flags: MessageFlags.Ephemeral,
			});
		}

		const totalPages = Math.ceil(reactions.length / PAGE_SIZE);
		const pageItems = reactions.slice(0, PAGE_SIZE);

		const embed = this.buildEmbed(
			pageItems,
			0,
			totalPages,
			reactions.length,
			interaction.guild,
			t,
		);
		const row = this.buildButtons(0, totalPages);

		return interaction.reply({
			embeds: [embed],
			components: totalPages > 1 ? [row] : [],
			flags: MessageFlags.Ephemeral,
		});
	}

	@Button("rr_list/:page")
	public async onPage(
		@Ctx() [interaction]: ButtonContext,
		@ComponentParam("page") pageStr: string,
	) {
		if (pageStr === "noop") {
			return interaction.deferUpdate();
		}

		const t: TranslationFn = (key, args) =>
			this.translate.getTranslation(key, interaction.guildLocale, args);

		const page = Number.parseInt(pageStr, 10);
		const reactions = await this.reaction.getAll(interaction.guild);
		const totalPages = Math.ceil(reactions.length / PAGE_SIZE);

		if (page < 0 || page >= totalPages) {
			return interaction.deferUpdate();
		}

		const start = page * PAGE_SIZE;
		const pageItems = reactions.slice(start, start + PAGE_SIZE);

		const embed = this.buildEmbed(
			pageItems,
			page,
			totalPages,
			reactions.length,
			interaction.guild,
			t,
		);
		const row = this.buildButtons(page, totalPages);

		return interaction.update({
			embeds: [embed],
			components: [row],
		});
	}

	private buildEmbed(
		items: ReactionItem[],
		page: number,
		totalPages: number,
		total: number,
		guild: Guild,
		t: TranslationFn,
	) {
		const embed = new EmbedBuilder()
			.setTitle(t("ReactionRoles.list.embed.title"))
			.setColor(0x5865f2)
			.setFooter({
				text: t("ReactionRoles.list.embed.footer", {
					PAGE: String(page + 1),
					TOTAL_PAGES: String(totalPages),
					TOTAL: String(total),
				}),
			});

		for (const item of items) {
			const jumpUrl = `https://discord.com/channels/${guild.id}/${item.channel}/${item.message}`;
			embed.addFields({
				name: `${item.emoji} — ${t("ReactionRoles.list.embed.type_label")} ${item.option}`,
				value: [
					`**${t("ReactionRoles.list.embed.channel")}:** ${channelMention(item.channel)}`,
					`**${t("ReactionRoles.list.embed.role")}:** ${roleMention(item.role)}`,
					`**${t("ReactionRoles.list.embed.message")}:** [${t("ReactionRoles.list.embed.jump")}](${jumpUrl})`,
				].join("\n"),
			});
		}

		return embed;
	}

	private buildButtons(page: number, totalPages: number) {
		return new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId(`rr_list/${page - 1}`)
				.setLabel("◀")
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(page === 0),
			new ButtonBuilder()
				.setCustomId("rr_list/noop")
				.setLabel(`${page + 1}/${totalPages}`)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(true),
			new ButtonBuilder()
				.setCustomId(`rr_list/${page + 1}`)
				.setLabel("▶")
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(page >= totalPages - 1),
		);
	}
}
