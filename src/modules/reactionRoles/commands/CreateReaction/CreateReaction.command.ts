import { CommandConfig, CommandPermissions } from "@/common/decorators";
import { MessageTools } from "@/modules/commands/Message";
import { localizationMapByKey } from "@necord/localization";
import { Inject } from "@nestjs/common";
import {
	// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
	Client,
	type TextChannel,
} from "discord.js";
import { Ctx, Options, type SlashCommandContext, Subcommand } from "necord";
import { ReactionRolesCommand } from "../../ReactionRoles.decorator";
import type {
	IReactionRolesEmbeds,
	IReactionRolesService,
} from "../../interfaces";
import type { IReaction } from "../../types";
import { ReactionRoles } from "../../types/constants";
// biome-ignore lint/style/useImportType: <Cannot useImportType in classes with>
import { CreateReactionDTO } from "./CreateReaction.dto";

@ReactionRolesCommand()
export class CreateReactionCommand {
	public constructor(
		@Inject(ReactionRoles.Service)
		private readonly reaction: IReactionRolesService,
		@Inject(ReactionRoles.Embeds) private readonly Embeds: IReactionRolesEmbeds,
		private readonly client: Client,
	) {}

	@Subcommand({
		name: "create",
		description: "Create an ReactionRole in the server",
		nameLocalizations: localizationMapByKey("ReactionRoles.create.name"),
		descriptionLocalizations: localizationMapByKey(
			"ReactionRoles.create.description",
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
		@Options() dto: CreateReactionDTO,
	) {
		const Channel = dto.channel as TextChannel;
		const MessageID = dto.messageId;
		const Message = await Channel.messages.fetch(MessageID);
		const Role = dto.role;
		const Emoji = dto.emoji;
		let Option = dto.option;
		if (!Option || Option > 6 || Number.isNaN(Option)) Option = 1;

		await this.reaction.CheckParams(
			this.client,
			interaction,
			Channel,
			MessageID,
			Message,
			Role,
			Emoji,
		);

		const data: IReaction = {
			channel: Channel.id,
			message: Message.id,
			role: Role.id,
			emoji: Emoji,
			option: Option,
		};
		const Created = await this.reaction.Create(interaction.guild, data);

		if (Created.status === "Created") {
			await MessageTools.react(Message, Emoji);
			return await interaction.reply({
				embeds: [await this.Embeds.ReactionRoleCreatedEmbed(interaction, data)],
			});
		}
		return await interaction.reply({
			embeds: [await this.Embeds.UnableToCreateReactionRoleEmbed(interaction)],
		});
	}
}
