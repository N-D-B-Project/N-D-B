import {
	CommandConfig,
	CommandPermissions,
	ValidatedOptions,
} from "@/common/decorators";
import { Buttons } from "@/modules/components/Buttons.component";
import { Extends } from "@/types/Constants";
import { localizationMapByKey } from "@necord/localization";
import { Inject, Logger } from "@nestjs/common";
import { Client, TextChannel } from "discord.js";
import { Ctx, SlashCommandContext, Subcommand } from "necord";
import { ReactionRolesCommand } from "../../ReactionRoles.decorator";
import type {
	IReactionRolesEmbeds,
	IReactionRolesService,
} from "../../interfaces";
import { ReactionRoles } from "../../types/constants";
import { DeleteReactionDTO } from "./DeleteReaction.dto";

@ReactionRolesCommand()
export class DeleteReactionCommand {
	public constructor(
		@Inject(ReactionRoles.Service)
		private readonly reaction: IReactionRolesService,
		@Inject(ReactionRoles.Embeds) private readonly Embeds: IReactionRolesEmbeds,
		@Inject(Extends.Buttons) private readonly Buttons: Buttons,
		private readonly client: Client,
	) {}

	private readonly logger = new Logger(DeleteReactionCommand.name);

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
		testOnly: true,
		ownerOnly: false,
	})
	public async onCommandRun(
		@Ctx() [interaction]: SlashCommandContext,
		@ValidatedOptions() dto: DeleteReactionDTO,
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
			Channel: Channel.id,
			Message: Message.id,
			Role: Role.id,
			Emoji,
		});

		if (REACT.status === "Deleted") {
			await interaction.reply({
				embeds: [
					await this.Embeds.ReactionRoleRemovedEmbed(interaction, Message),
				],
			});
			await Message.reactions.cache.get(Emoji).remove();
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
