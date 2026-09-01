import { localizationMapByKey } from "@necord/localization";
import { Inject } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { Client, type TextChannel } from "discord.js";
import { Ctx, Options, type SlashCommandContext, Subcommand } from "necord";
import {
	CommandConfig,
	CommandPermissions,
} from "#src/common/decorators/index.js";
import type {
	IReactionRolesEmbeds,
	IReactionRolesService,
} from "../../interfaces/index.js";
import { ReactionRolesCommand } from "../../ReactionRoles.decorator.js";
import { ReactionRoles } from "../../types/constants.js";
import { DeleteStatus } from "../../types/index.js";
// biome-ignore lint/style/useImportType: <Cannot useImportType in classes with validation system>
import { DeleteReactionDTO } from "./DeleteReaction.dto.js";

@ReactionRolesCommand()
export class DeleteReactionCommand {
	public constructor(
		@Inject(ReactionRoles.Service)
		private readonly reaction: IReactionRolesService,
		@Inject(ReactionRoles.Embeds) private readonly Embeds: IReactionRolesEmbeds,
		private readonly client: Client,
	) {}

	@Subcommand({
		name: "delete",
		description: "Delete an existent ReactionRole",
		nameLocalizations: localizationMapByKey("ReactionRoles.delete.name"),
		descriptionLocalizations: localizationMapByKey(
			"ReactionRoles.delete.description",
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
		@Options() dto: DeleteReactionDTO,
	) {
		const Channel = dto.channel as TextChannel;
		const MessageID = dto.messageId;
		const Message = await Channel.messages.fetch(MessageID);
		const Role = dto.role;
		const Emoji = dto.emoji;

		await this.reaction.CheckParams(
			this.client,
			interaction,
			Channel,
			MessageID,
			Message,
			Role,
			Emoji,
		);

		const REACT = await this.reaction.Delete(interaction.guild, {
			channel: Channel.id,
			message: Message.id,
			role: Role.id,
			emoji: Emoji,
		});

		if (REACT.status === DeleteStatus.Deleted) {
			await interaction.reply({
				embeds: [
					await this.Embeds.ReactionRoleRemovedEmbed(interaction, Message),
				],
			});
			const existing = Message.reactions.cache.find(
				(r) => r.emoji.name === Emoji || r.emoji.toString() === Emoji,
			);
			await existing?.remove().catch(() => {});
		} else {
			interaction.reply({
				embeds: [
					await this.Embeds.UnableToDeleteReactionRoleEmbed(
						interaction,
						Message,
					),
				],
			});
		}
	}
}
