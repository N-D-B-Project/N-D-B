import { CommandConfig, CommandPermissions, ValidatedOptions } from "@/common/decorators/";
import { CommandConfigGuard, CommandPermissionsGuard } from "@/common/guards";
import { MessageTools } from "@/modules/bot/commands/Message";
import { localizationMapByKey } from "@necord/localization";
import { Inject, Injectable, Logger, UseGuards } from "@nestjs/common";
import { Client, TextChannel } from "discord.js";
import { Ctx, SlashCommandContext, Subcommand } from "necord";
import type { IReactionRolesEmbeds, IReactionRolesService } from "../../interfaces";
import type { IReaction } from "../../types";
import { ReactionRoles } from "../../types/constants";
import { CreateReactionDTO } from "./CreateReaction.dto";

@Injectable()
export class CreateReactionCommand {
	public constructor(
		@Inject(ReactionRoles.Service) private readonly reaction: IReactionRolesService,
		@Inject(ReactionRoles.Embeds) private readonly Embeds: IReactionRolesEmbeds,
		private readonly client: Client,
	) {}

	private readonly logger = new Logger(CreateReactionCommand.name);

	@Subcommand({
		name: "create",
		description: "Create an ReactionRole in the server",
		nameLocalizations: localizationMapByKey("ReactionRoles.create.name"),
		descriptionLocalizations: localizationMapByKey("ReactionRoles.create.description"),
	})
	@CommandConfig({ category: "🎩 ReactionRole", disable: false })
	@CommandPermissions({
		user: ["SendMessages", "AddReactions", "ManageRoles"],
		bot: ["EmbedLinks", "AddReactions", "ManageRoles"],
		guildOnly: false,
		ownerOnly: false,
	})
	@UseGuards(CommandConfigGuard, CommandPermissionsGuard)
	public async onCommandRun(@Ctx() [interaction]: SlashCommandContext, @ValidatedOptions() dto: CreateReactionDTO) {
		const Channel = dto.channel as TextChannel;
		const MessageID = dto.messageId;
		const Message = await Channel.messages.fetch(MessageID);
		const Role = dto.role;
		const Emoji = dto.emoji;
		let Option = dto.option;
		if (!Option || Option > 6 || Number.isNaN(Option)) Option = 1;

		await this.reaction.CheckParams(this.client, interaction, Channel, MessageID, Message, Role, Emoji);

		const data: IReaction = {
			Channel: Channel.id,
			Message: Message.id,
			Role: Role.id,
			Emoji,
			Option,
		};
		const Created = await this.reaction.Create(interaction.guild, data);

		if (Created.status === "Created") {
			await MessageTools.react(Message, Emoji);
			return await interaction.reply({ embeds: [await this.Embeds.ReactionRoleCreatedEmbed(interaction, data)] });
		}
		return await interaction.reply({ embeds: [await this.Embeds.UnableToCreateReactionRoleEmbed(interaction)] });
	}
}
