import { CommandConfig, CommandPermissions, ValidatedOptions } from "@/common/decorators";
import { CommandConfigGuard, CommandPermissionsGuard } from "@/common/guards";
import { Buttons } from "@/modules/bot/components/Buttons.component";
import { Extends } from "@/types/Constants";
import { Inject, Injectable, Logger, UseGuards } from "@nestjs/common";
import { Client, TextChannel } from "discord.js";
import { Ctx, SlashCommandContext, Subcommand } from "necord";
import type { IReactionRolesEmbeds, IReactionRolesService } from "../../interfaces";
import { ReactionRoles } from "../../types/constants";
import { EditReactionDTO } from "./EditReaction.dto";

@Injectable()
export class EditReactionCommand {
	public constructor(
		@Inject(ReactionRoles.Service) private readonly reaction: IReactionRolesService,
		@Inject(ReactionRoles.Embeds) private readonly Embeds: IReactionRolesEmbeds,
		@Inject(Extends.Buttons) private readonly Buttons: Buttons,
		private readonly client: Client,
	) {}

	private readonly logger = new Logger(EditReactionCommand.name);

	@Subcommand({
		name: "edit",
		description: "",
	})
	@CommandConfig({ category: "🎩 ReactionRole", disable: false })
	@CommandPermissions({
		user: ["SendMessages", "AddReactions", "ManageRoles"],
		bot: ["EmbedLinks", "AddReactions", "ManageRoles"],
		guildOnly: false,
		ownerOnly: false,
	})
	@UseGuards(CommandConfigGuard, CommandPermissionsGuard)
	public async onCommandRun(@Ctx() [interaction]: SlashCommandContext, @ValidatedOptions() dto: EditReactionDTO) {
		const Channel = dto.channel as TextChannel;
		const MessageID = dto.messageId;
		const Message = await Channel.messages.fetch(MessageID);
		const Role = dto.role;
		const Emoji = dto.emoji;

		await this.reaction.CheckParams(this.client, interaction, Channel, MessageID, Message, Role, Emoji);

		const REACT = await this.reaction.Delete(interaction.guild, {
			Channel: Channel.id,
			Message: Message.id,
			Role: Role.id,
			Emoji,
		});

		if (REACT.status === "Deleted") {
			await interaction.reply({ embeds: [await this.Embeds.ReactionRoleRemovedEmbed(interaction, Message)] });
			await Message.reactions.cache.get(Emoji).remove();
		} else {
			interaction.reply({ embeds: [await this.Embeds.UnableToDeleteReactionRoleEmbed(interaction, Message)] });
		}
	}
}
