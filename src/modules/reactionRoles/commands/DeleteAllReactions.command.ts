import {
	CurrentTranslate,
	localizationMapByKey,
	type TranslationFn,
} from "@necord/localization";
import { Inject } from "@nestjs/common";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	MessageFlags,
} from "discord.js";
import {
	Button,
	type ButtonContext,
	ComponentParam,
	Ctx,
	type SlashCommandContext,
	Subcommand,
} from "necord";
import { CommandConfig, CommandPermissions } from "@/common/decorators";
import { InteractionTools } from "../../commands/Interaction";
import type {
	IReactionRolesEmbeds,
	IReactionRolesService,
} from "../interfaces";
import { ReactionRolesCommand } from "../ReactionRoles.decorator";
import { DeleteStatus } from "../types";
import { ReactionRoles } from "../types/constants";

enum DeleteAllAction {
	Yes = "yes",
	No = "no",
}

@ReactionRolesCommand()
export class DeleteAllReactionsCommand {
	public constructor(
		@Inject(ReactionRoles.Service)
		private readonly reaction: IReactionRolesService,
		@Inject(ReactionRoles.Embeds) private readonly Embeds: IReactionRolesEmbeds,
	) {}

	@Subcommand({
		name: "delete_all",
		description: "Delete all ReactionRoles in the server",
		nameLocalizations: localizationMapByKey("ReactionRoles.deleteall.name"),
		descriptionLocalizations: localizationMapByKey(
			"ReactionRoles.deleteall.description",
		),
	})
	@CommandConfig({ category: "🎩 ReactionRole", disable: false })
	@CommandPermissions({
		user: ["SendMessages", "ManageRoles"],
		bot: ["EmbedLinks"],
		guildOnly: true,
		testOnly: false,
		ownerOnly: false,
	})
	public async onCommandRun(
		@Ctx() [interaction]: SlashCommandContext,
		@CurrentTranslate() t: TranslationFn,
	) {
		await interaction.reply({
			embeds: [
				await this.Embeds.ReactionRoleDeleteAllEmbed(
					interaction,
					"Confirm",
					null,
				),
			],
			components: [this.buildButtons(interaction.user.id, t)],
			flags: MessageFlags.Ephemeral,
		});
	}

	@Button("rr_deleteall/:value/:invokerId")
	public async onButton(
		@Ctx() [interaction]: ButtonContext,
		@ComponentParam("value") value: DeleteAllAction,
		@ComponentParam("invokerId") invokerId: string,
	) {
		if (interaction.user.id !== invokerId) {
			return interaction.reply({
				content: "Only the command invoker can use these buttons.",
				flags: MessageFlags.Ephemeral,
			});
		}

		if (value === DeleteAllAction.No) {
			return InteractionTools.update(interaction, {
				embeds: [
					await this.Embeds.ReactionRoleDeleteAllEmbed(
						interaction,
						"Cancel",
						null,
					),
				],
				components: [],
			});
		}

		const { count, status } = await this.reaction.DeleteAll(interaction.guild);

		if (status === DeleteStatus.Deleted) {
			return InteractionTools.update(interaction, {
				embeds: [
					await this.Embeds.ReactionRoleDeleteAllEmbed(
						interaction,
						"Success",
						count,
					),
				],
				components: [],
			});
		}

		return InteractionTools.update(interaction, {
			embeds: [await this.Embeds.UnableToDeleteAllReactionRoleEmbed(interaction)],
			components: [],
		});
	}

	private buildButtons(invokerId: string, t: TranslationFn) {
		return new ActionRowBuilder<ButtonBuilder>().addComponents([
			new ButtonBuilder()
				.setCustomId(`rr_deleteall/${DeleteAllAction.Yes}/${invokerId}`)
				.setLabel(t("Tools.Buttons.Labels.Confirm.YES"))
				.setEmoji("719710630881525881")
				.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
				.setCustomId(`rr_deleteall/${DeleteAllAction.No}/${invokerId}`)
				.setLabel(t("Tools.Buttons.Labels.Confirm.NO"))
				.setEmoji("719710607405875321")
				.setStyle(ButtonStyle.Danger),
		]);
	}
}
