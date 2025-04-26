import {
	CommandConfig,
	CommandPermissions,
	ValidatedOptions,
} from "@/common/decorators";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { Buttons } from "@/modules/components/Buttons.component";
import {
	Embeds,
	Extends,
	type IReactionRolesEmbeds,
	type IReactionRolesService,
	Services,
} from "@/types";
import { localizationMapByKey } from "@necord/localization";
import { Inject, Logger } from "@nestjs/common";
import {
	ApplicationIntegrationType,
	// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
	Client,
	InteractionContextType,
	type TextChannel,
} from "discord.js";
import { Ctx, type SlashCommandContext, Subcommand } from "necord";
import { ReactionRolesCommand } from "../../ReactionRoles.decorator";
// biome-ignore lint/style/useImportType: <Cannot useImportType in classes with validation system>
import { DeleteReactionDTO } from "./DeleteReaction.dto";

@ReactionRolesCommand()
export class DeleteReactionCommand {
	public constructor(
		@Inject(Services.ReactionRoles)
		private readonly reaction: IReactionRolesService,
		@Inject(Embeds.ReactionRoles) private readonly embeds: IReactionRolesEmbeds,
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
		integrationTypes: [ApplicationIntegrationType.GuildInstall],
		contexts: [InteractionContextType.Guild],
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
			channel: Channel.id,
			message: Message.id,
			role: Role.id,
			emoji: Emoji,
		});

		if (REACT.status === "Deleted") {
			await interaction.reply({
				embeds: [
					await this.embeds.ReactionRoleRemovedEmbed(interaction, Message),
				],
			});
			await Message.reactions.cache.get(Emoji).remove();
		} else {
			interaction.reply({
				embeds: [
					await this.embeds.UnableToDeleteReactionRoleEmbed(
						interaction,
						Message,
					),
				],
			});
		}
	}
}
