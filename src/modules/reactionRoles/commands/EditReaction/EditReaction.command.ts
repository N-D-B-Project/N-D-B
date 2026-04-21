import { localizationMapByKey } from "@necord/localization";
import { Inject } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { Client, type TextChannel } from "discord.js";
import { Ctx, Options, type SlashCommandContext, Subcommand } from "necord";
import { CommandConfig, CommandPermissions } from "@/common/decorators";
import type {
	IReactionRolesEmbeds,
	IReactionRolesService,
} from "../../interfaces";
import { ReactionRolesCommand } from "../../ReactionRoles.decorator";
import { type REACTION_OPTIONS, UpdateStatus } from "../../types";
import { ReactionRoles } from "../../types/constants";
// biome-ignore lint/style/useImportType: <Cannot useImportType in classes with validation system>
import { EditReactionDTO } from "./EditReaction.dto";

@ReactionRolesCommand()
export class EditReactionCommand {
	public constructor(
		@Inject(ReactionRoles.Service)
		private readonly reaction: IReactionRolesService,
		@Inject(ReactionRoles.Embeds) private readonly Embeds: IReactionRolesEmbeds,
		private readonly client: Client,
	) {}

	@Subcommand({
		name: "edit",
		nameLocalizations: localizationMapByKey("ReactionRoles.edit.name"),
		description: "Edit an existing ReactionRole",
		descriptionLocalizations: localizationMapByKey(
			"ReactionRoles.edit.description",
		),
	})
	@CommandConfig({ category: "🎩 ReactionRole", disable: false })
	@CommandPermissions({
		user: ["SendMessages", "AddReactions", "ManageRoles"],
		bot: ["EmbedLinks", "AddReactions", "ManageRoles"],
		guildOnly: false,
		testOnly: false,
		ownerOnly: false,
	})
	public async onCommandRun(
		@Ctx() [interaction]: SlashCommandContext,
		@Options() dto: EditReactionDTO,
	) {
		const channel = dto.channel as TextChannel;
		const message = await channel.messages.fetch(dto.messageId).catch(() => null);

		if (!message) {
			return await interaction.reply({
				embeds: [await this.Embeds.MessageNotFoundEmbed(interaction)],
			});
		}

		await this.reaction.CheckParams(
			this.client,
			interaction,
			channel,
			dto.messageId,
			message,
			dto.role,
			dto.emoji,
		);

		const reaction = {
			channel: channel.id,
			message: message.id,
			role: dto.role.id,
			emoji: dto.emoji,
		};

		const result = await this.reaction.Update(
			interaction.guild,
			reaction,
			dto.newOption as REACTION_OPTIONS,
		);

		if (result.status === UpdateStatus.Updated) {
			return await interaction.reply({
				embeds: [
					await this.Embeds.ReactionRoleUpdatedEmbed(
						interaction,
						reaction,
						dto.newOption as REACTION_OPTIONS,
					),
				],
			});
		}

		return await interaction.reply({
			embeds: [
				await this.Embeds.UnableToUpdateReactionRoleEmbed(interaction, message),
			],
		});
	}
}
